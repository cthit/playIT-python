import re
import peewee
import requests
import functools
import json
import logging

from tornado import websocket, escape
from src.models.base import BaseModel, Serializer
from src.utils.memcache import RedisMemcache

TOKEN_CHECK_URL = "https://account.chalmers.it/userInfo.php?token=%s"
PLAYER_TOKEN = "42BabaYetuHerpaderp"
ADMIN_GROUP = "playITAdmin"


class AuthenticationError(Exception):
    pass


class Authorized(object):
    """Decorate methods with this to require that the user be logged in.
    """

    def __init__(self, group=None):
        self._group = group

    def __call__(self, method):

        @functools.wraps(method)
        def wrapper(cls, *args, **kwargs):

            token = args[0].get("token")

            if not token:
                raise AuthenticationError("NO TOKEN")

            if token == PLAYER_TOKEN:
                return method(cls, *args, **kwargs)

            cls._token = token
            user = RedisMemcache.get(token)

            if not user:
                url = TOKEN_CHECK_URL % token
                response = requests.get(url)
                data = response.json()
                if data.get("cid"):
                    user = data
                    RedisMemcache.set("token:"+token, user)
                else:
                    raise AuthenticationError("INVALID TOKEN")

            if self._group and self._group not in user.get("groups"):
                raise AuthenticationError("You need to be member of %s to do that" % self._group)

            cls._user = user

            return method(cls, *args, **kwargs)

        return wrapper


class BaseHandler(websocket.WebSocketHandler):

    _token = ""
    _user = None

    def check_origin(self, origin):
        return True

    def load_json(self, string):
        try:
            return json.loads(string)
        except ValueError as e:
            msg = "Invalid JSON  Parser gave error: %r" % e
            self.close(400, reason=msg)
            return False

    def destroy(self):
        RedisMemcache.delete("token:"+self._token)

    def close(self, code=None, reason=None):
        self.destroy()
        super(BaseHandler, self).close(code, reason)

    def open(self):
        logging.info("New connection")
        self.send("GREETING")

    def on_message(self, message):
        logging.info("Message received: %s" % message)

        try:
            method, dump = re.split("\s", message, 1)
        except ValueError:
            self.close(400, "Invalid format, expecting 'METHOD DATA' got %s " % message)
            return

        try:
            data = self.load_json(dump)
        except ValueError as e:
            self.close(400, "Invalid json data: %s" % e)
            return

        func = getattr(self, "action_" + method)
        if not func:
            self.close(405, "Method (%s) does not exist" % method)
            return
        try:
            response = func(data)
        except AuthenticationError as e:
            self.close(403, e)
            return
        except Exception as e:
            self.close(500, e)
            return

        no_responses = len(response)
        if no_responses > 0:
            topic = response[0]

            if no_responses > 1:
                package = response[1]
            else:
                package = dict()

            self.send(topic, package)
        else:
            logging.error("No response")
            self.close(500, "Internal server error")

    def on_close(self):
        self.destroy()
        logging.info("Connection closed")

    def send(self, topic, obj=dict(), serializer=Serializer.datetime):
        dump = None
        try:
            dump = json.dumps(obj, default=serializer)
        except Exception as e:
            msg = "Failed to JSON dump item of type: %s with representation %r with error: %r" % (type(obj), obj, e)
            logging.error(msg)

        if isinstance(dump, dict):
            dump = escape.json_encode(dump)

        if not dump:
            dump = escape.json_encode(json.dumps("Internal server error", default=serializer))

        msg = "%s %s" % (topic, dump)
        logging.info("Sending: "+msg)

        super(BaseHandler, self).write_message(msg)

handlers = [
    (r'/ws', BaseHandler)
]
