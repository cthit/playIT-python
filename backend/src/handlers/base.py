__author__ = 'horv'

from tornado import websocket, escape
import re
import peewee
import requests
import functools
import json
import logging
from src.models.base import BaseModel, Serializer
from src.utils.memcache import RedisMemcache
clients = set()

TOKEN_CHECK_URL = "http://lan.chalmers.it/?p=userInfo"
PLAYER_TOKEN = "42BabaYetuHerpaderp"
ADMIN_GROUP = "playITAdmin"

SUCCESS = "/SUCCESS"
NEW = "/NEW"
UPDATE = "/UPDATE"
FAIL = "/FAIL"
DELETE = "/DELETE"
STATUS = "/STATUS"


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
                response = requests.get(TOKEN_CHECK_URL,headers={'chalmers_lan_auth':token})
                data = response.json()
                if data.get("cid"):
                    user = data
                    RedisMemcache.set("token:"+token, user)
                else:
                    raise AuthenticationError("INVALID TOKEN")

            if self._group and self._group not in user.get("groups"):
                raise AuthenticationError("You need to be member of %s to do that" % self._group)

            cls._user = user

            return method(cls, *args, user=user, **kwargs)

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
        clients.remove(self)
        RedisMemcache.delete("token:"+self._token)

    def close(self, code=None, reason=None):
        self.destroy()
        super(BaseHandler, self).close(code, reason)

    def open(self):
        clients.add(self)
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
            if no_responses > 2:
                formatter = response[2]
            else:
                formatter = lambda x: x # noqa

            self.send(topic, package, formater=formatter)
        else:
            logging.error("No response")
            self.close(500, "Internal server error")

    def on_close(self):
        self.destroy()
        logging.info("Connection closed")

    @staticmethod
    def broadcast(topic, msg, formater=lambda x: x, client_type=None):
        for client in clients:
            if not client_type or type(client) == client_type:
                client.send(topic, msg, formater=formater)

    def send(self, topic, obj=dict(), serializer=Serializer.datetime, formater=lambda x: x, format_dict=True):
        if isinstance(obj, BaseModel):
            dump = obj.to_json()
        else:
            if isinstance(obj, peewee.SelectQuery):
                obj = [formater(d) for d in obj.dicts(dicts=format_dict)]
            else:
                obj = formater(obj)

            dump = json.dumps(obj, default=serializer)

        if isinstance(dump, dict):
            dump = formater(dump)
            dump = escape.json_encode(dump)

        msg = "%s %s" % (topic, dump)
        logging.info("Sending: "+msg)
        super(BaseHandler, self).write_message(msg)

handlers = [
    (r'/ws', BaseHandler)
]
