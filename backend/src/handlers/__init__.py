from src.handlers import base, derp, userclient, playbackclient


class DefaultHandler(object):
    pass

default = [
    (r'/.*', DefaultHandler)
]

handlers = \
    derp.handlers + \
    base.handlers + \
    userclient.handlers + \
    playbackclient.handlers + \
    default
