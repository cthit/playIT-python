from src.handlers.derp import DerpHandler
from src.handlers.base import BaseHandler
from src.handlers.userclient import UserClient
from src.handlers.playbackclient import PlaybackClient


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

