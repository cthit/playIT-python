from src.handlers.base import BaseHandler
import logging


class Actions(BaseHandler):

    def action_derp(self, data):
        logging.info("We got stuff to derp %r" % data)
        return "We did good"

    def action_herp(self, data):
        logging.info("We got stuff to herp %r" % data)
        return "We did great"

    def action_all(self, data):
        logging.info("Derp")
        self.broadcast("Hello clientsssszzzzz")

handlers = [
    (r'/ws/action', Actions)
]