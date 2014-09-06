__author__ = 'horv'

from tornado import websocket, escape
import logging
import json
import re
import redis
import json
import peewee
import requests
import functools
from src.models.base import *
from src.utils.memcache import *
clients = set()

TOKEN_CHECK_URL = "https://chalmers.it/auth/userInfo.php?token=%s"


class AuthenticationError(Exception):
    pass


class Authorized(object):
    """Decorate methods with this to require that the user be logged in.
    """
    def __call__(self, method):

        @functools.wraps(method)
        def wrapper(cls, *args, **kwargs):

            token = args[0].get("token")

            if not token:
                raise AuthenticationError("NO TOKEN")

            cls._token = token
            user = RedisMemcache.get(token)

            if not user:
                url = TOKEN_CHECK_URL % token
                response = requests.get(url)
                data = response.json()
                if data.get("cid"):
                    RedisMemcache.set("token:"+token, data)
                else:
                    raise AuthenticationError("INVALID TOKEN")

            return method(cls, *args, **kwargs)

        return wrapper


class BaseHandler(websocket.WebSocketHandler):

    _token = ""

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
        except AuthenticationError as _:
            self.close(403, "Invalid token")
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
                formatter = lambda x: x

            self.send(topic, package, formater=formatter)
        else:
            logging.error("No response")
            self.close(500, "Internal server error")

    def on_close(self):
        self.destroy()
        logging.info("Connection closed")

    @staticmethod
    def broadcast(topic, msg, formater=lambda x: x):
        for client in clients:
            client.send(topic, msg, formater=formater)

    def send(self, topic, obj=dict(), serializer=Serializer.datetime, formater=lambda x: x, format_dict=True):
        if isinstance(obj, BaseModel):
            dump = obj.to_json()
        else:
            if isinstance(obj, peewee.SelectQuery):
                obj = [formater(d) for d in obj.dicts(dicts=format_dict)]

            dump = json.dumps(obj, default=serializer)

        if isinstance(dump, dict):
            dump = escape.json_encode(dump)

        msg = "%s %s" % (topic, dump)
        super(BaseHandler, self).write_message(msg)

handlers = [
    (r'/ws', BaseHandler)
]