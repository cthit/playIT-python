from src.handlers.base import *
from src.models.media_item import MediaItem
from src.handlers.userclient import UserClient

PLAYBACK = "PLAYBACK"


class PlaybackClient(BaseHandler):

    _current_item = None

    @Authorized(group="player")
    def action_pop(self, data):
        item = MediaItem.get_queue().first()
        if not item:
            return PLAYBACK+FAIL, dict()

        self._current_item = item
        UserClient.set_current(item)
        item.delete_instance()
        self.broadcast(PLAYBACK+NEW, item)

        return PLAYBACK+SUCCESS, ""

    @Authorized(group="player")
    def action_get_current(self):
        return PLAYBACK+UPDATE, self._current_item





handlers = [
    (r'/ws/playback', PlaybackClient)
]
