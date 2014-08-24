from src.handlers.derp import DerpHandler


class DefaultHandler(object):
    pass

default = [
    (r'/.*', DefaultHandler)
]

handlers = \
    derp.handlers + \
    default

