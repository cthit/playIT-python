import json
import logging
import re

from tornado import escape
from tornado.websocket import WebSocketHandler

from src.handlers.decorators.authorized import AuthenticationError
from src.models.serializer import Serializer
from src.services.token_cache_service import TokenCacheService


class BaseHandler(WebSocketHandler):

    def data_received(self, chunk):
        raise NotImplementedError("Not implemented yet")

    _token = ""
    _user = None

    def check_origin(self, origin):
        return True

    def load_json(self, string):
        try:
            return json.loads(string)
        except ValueError as e:
            msg = "Invalid JSON  Parser gave error: %r" % e
            self.close(400, msg)
            return False

    def destroy(self):
        TokenCacheService.delete_token(self._token)

    def close(self, *args, **kwargs):
        (code, reason) = args[0]
        self.destroy()
        super().close(code, reason)

    def open(self):
        logging.debug("New connection")
        self.send("GREETING")

    def on_message(self, message):
        logging.debug("Message received: %s" % message)

        try:
            method, dump = re.split("\s", message, 1)
            logging.info("Method: %s" % method)
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
            self.close(403, e.message)
            return
        except Exception as e:
            self.close(500, e.__str__())
            logging.error("Exceptption")
            logging.error(e)
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
        logging.debug("Connection closed")

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
            dump = escape.json_encode(json.dumps("Internal server error when serialising", default=serializer))

        msg = "%s %s" % (topic, dump)
        if isinstance(obj, dict):
            logging.info("%s %s" % (topic, obj.get('id', "No id")))
        logging.debug("Sending: " + msg)

        super().write_message(msg)

handlers = [
    (r'/ws', BaseHandler)
]
