__author__ = 'horv'

from tornado import websocket
import logging
import json

clients = set()


class BaseHandler(websocket.WebSocketHandler):

    def check_origin(self, origin):
        return True

    def load_json(self, string):
        try:
            return json.loads(string)
        except ValueError as e:
            msg = "Invalid JSON  Parser gave error: %r" % e
            self.close(400, reason=msg)
            return False

    def open(self):
        clients.add(self)
        logging.info("New connection")
        self.write_message("Hello Client!")

    def on_message(self, message):
        logging.info("Message received: %s" % message)

        parsed_message = self.load_json(message)
        if not parsed_message:
            return

        method = parsed_message.get("method")

        if not method:
            self.close(400, "Missing method")
            return

        func = getattr(self, "action_" + method)
        if not func:
            self.close(405, "Method does not exist")
            return

        response = func(parsed_message.get("data", dict()))
        if response:
            self.write_message(response)
        else:
            logging.error("No response you MF")
            self.close(500, "Internal server error")

    def on_close(self):
        clients.remove(self)
        logging.info("Connection closed MOTHERFUCKER")

    @staticmethod
    def broadcast(msg):
        for client in clients:
            client.write_message(msg)


handlers = [
    (r'/ws', BaseHandler)
]