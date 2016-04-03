from src.handlers import base, userclient, playbackclient


class DefaultHandler(object):
    pass

default = [
    (r'/.*', DefaultHandler)
]

handlers = \
    base.handlers + \
    userclient.handlers + \
    playbackclient.handlers + \
    default
