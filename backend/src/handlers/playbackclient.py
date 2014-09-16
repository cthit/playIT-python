from src.handlers.base import *
from src.models.media_item import MediaItem
from src.models.playlist_item import PlaylistItem
from src.handlers.userclient import UserClient

PLAYBACK = "PLAYBACK"


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
        self.broadcast(PLAYBACK+NEW, item)

        return PLAYBACK+SUCCESS, ""

    def _play_playlist_item(self):
        playlist = PlaylistItem.get_queue().first()
        if not playlist:
            return PLAYBACK+FAIL, ""

        if playlist == self._current_playlist:
            return self._send_item(playlist, self._index)
        else:
            return self._send_item(playlist, 0)

    def _send_item(self, playlist, index):
        item = PlaylistItem.get_index(playlist, index)

        self._current_playlist = playlist
        self._index = index + 1
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
