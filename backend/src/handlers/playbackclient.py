import logging

from src.constants import *
from src.handlers.base import BaseHandler
from src.handlers.decorators.authorized import Authorized
from src.models.media_item import MediaItem
from src.models.playlist_item import PlaylistItem
from src.services.clients_service import ClientsService
from src.services.item_service import ItemService


class PlaybackClient(BaseHandler):

    _current_item = None
    _current_playlist = None
    _index = 0

    def open(self):
        super().open()
        ClientsService.add_playback_client(self)

    def close(self, *args, **kwargs):
        super().close(args, kwargs)
        ClientsService.remove_playback_client(self)

    @Authorized(group="player")
    def action_pop(self, data):
        item = MediaItem.get_queue().first()
        if not item:
            return self._play_playlist_item()

        item_dict = item.get_dictionary()
        self._current_item = item_dict
        ItemService.set_current(item_dict)
        item.delete_instance()
        ClientsService.broadcast_to_playback_clients(ITEM+NEW, item_dict)

        return ITEM+SUCCESS, ""

    def _play_playlist_item(self):
        playlist = PlaylistItem.get_queue().first()
        if not playlist:
            self._current_item = None
            ItemService.set_current(None)
            return ITEM+FAIL, "No item in queue"

        if playlist != self._current_playlist:
            self._index = 0

        return self._send_item(playlist, self._index)

    def _send_item(self, playlist, index):
        item_dict = PlaylistItem.get_index(playlist, index)

        self._current_playlist = playlist
        self._index = index + 1
        self._current_item = item_dict
        ItemService.set_current(item_dict)
        ClientsService.broadcast_to_playback_clients(ITEM+NEW, item_dict)

        return ITEM+SUCCESS, ""

    @Authorized(group="player")
    def action_get_current(self):
        return ITEM+UPDATE, self._current_item


handlers = [
    (r'/ws/playback', PlaybackClient)
]
