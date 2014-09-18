from src.handlers.base import *
from src.models.media_item import MediaItem
from src.models.playlist_item import PlaylistItem
from src.handlers.userclient import UserClient

ITEM = "MEDIA_ITEM"


class PlaybackClient(BaseHandler):

    _current_item = None
    _current_playlist = None
    _index = 0

    @Authorized(group="player")
    def action_pop(self, data):
        item = MediaItem.get_queue().first()
        if not item:
            return self._play_playlist_item()

        self._current_item = item
        UserClient.set_current(item)
        item.delete_instance()
        self.broadcast(ITEM+NEW, item, client_type=PlaybackClient)

        return ITEM+SUCCESS, ""

    def _play_playlist_item(self):
        playlist = PlaylistItem.get_queue().first()
        if not playlist:
            self._current_item = None
            UserClient.set_current(None)
            return ITEM+FAIL, "No item in queue"

        if playlist != self._current_playlist:
            self._index = 0

        return self._send_item(playlist, self._index)

    def _send_item(self, playlist, index):
        item = PlaylistItem.get_index(playlist, index)

        self._current_playlist = playlist
        self._index = index + 1
        self._current_item = item
        UserClient.set_current(item)
        item.delete_instance()
        self.broadcast(ITEM+NEW, item)

        return ITEM+SUCCESS, ""

    @Authorized(group="player")
    def action_get_current(self):
        return ITEM+UPDATE, self._current_item





handlers = [
    (r'/ws/playback', PlaybackClient)
]
