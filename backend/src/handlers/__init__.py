from src.handlers.derp import DerpHandler
from src.handlers.base import BaseHandler
from src.handlers.actions import Actions


class DefaultHandler(object):
    pass

default = [
    (r'/.*', DefaultHandler)
]

handlers = \
    derp.handlers + \
    base.handlers + \
    actions.handlers + \
    default

