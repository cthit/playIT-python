import logging

from src.models.media_item import MediaItem, MediaItemError
from src.models.playlist_item import PlaylistItem
from src.services.voting_service import VotingService
from src.services.clients_service import ClientsService
from src.services.item_service import ItemService
from src.constants import *


class UserClientActionsService(object):
    @staticmethod
    def add_item(cid, data, external_id, media_type):
        if "list" in media_type:
            (success, msg, item) = UserClientActionsService._add_list_item(cid, data, media_type, external_id)
        else:
            (success, msg, item) = UserClientActionsService._add_item(cid, data, media_type, external_id)

        if not ItemService.get_current():
            ClientsService.broadcast_to_playback_clients(QUEUE + UPDATE, item)

        return success, msg, ItemService.convert_from_query_item_and_decorate_item_user_voted(item, cid)

    @staticmethod
    def _add_list_item(cid, data, media_type, external_id):
        try:
            item = PlaylistItem.create_media_item(cid, media_type, external_id)
            item.save()
            VotingService.add_vote(cid, item, data, new=True)
            return True, "", item
        except MediaItemError as e:
            msg = "Failed to save %s due to: %s" % (data, e)
            logging.error(msg)
            return False, msg, None

    @staticmethod
    def _add_item(cid, data, media_type, external_id):
        try:
            item = MediaItem.create_media_item(cid, media_type, external_id)
            item.save()
            VotingService.add_vote(cid, item, data, new=True)
            return True, "", item
        except MediaItemError as e:
            msg = "Failed to save %s due to: %s" % (data, e)
            logging.error(msg)
            return False, msg, None

    @staticmethod
    def get_queue(cid):
        items = MediaItem.get_queue()
        items = map(lambda i: ItemService.convert_from_query_item_and_decorate_item_user_voted(i, cid), items)
        return [i for i in items]

    @staticmethod
    def get_playlist_queue(cid):
        return [ItemService.convert_from_query_item_and_decorate_playlist_item_user_voted(i, cid) for i in
                PlaylistItem.get_queue(cid)]

    @staticmethod
    def delete_item(item):
        return item.delete_instance()
