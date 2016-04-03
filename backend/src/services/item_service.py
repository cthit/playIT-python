from src.constants import *
from src.models.playlist_item import PlaylistItem
from src.models.media_item import MediaItem
from src.services.clients_service import ClientsService


class ItemService(object):
    CURRENT_ITEM = None

    @staticmethod
    def get_item_uri(item):
        item_uri = ITEM
        if "list" in item.type:
            item_uri = LIST

        return item_uri

    @staticmethod
    def get_item(data, user_id=None):
        external_id = data.get("id", "NO_ID_SUPPLIED")
        media_type = data.get("type", "NO_TYPE_SUPPLIED")

        if "list" in media_type:
            item = PlaylistItem.get_item(media_type, external_id)
        else:
            item = MediaItem.get_item(media_type, external_id, user_id)

        return item

    @staticmethod
    def format_media_item(item):
        value = item.get("value", 0)
        if value == '':
            value = '0'
        item["value"] = int(float(value))

        return item

    @staticmethod
    def set_current(item):
        ItemService.CURRENT_ITEM = item
        ClientsService.broadcast(PLAYING + STATUS, item)

    @staticmethod
    def get_current():
        return ItemService.CURRENT_ITEM

    @staticmethod
    def convert_from_query_item_and_decorate_playlist_item_user_voted(playlist_item, user_id=None):
        if not user_id or user_id == "NO_CID":
            return ItemService._decorate_with_value(playlist_item.get_dictionary(), playlist_item)

        from src.services.voting_service import VotingService
        item_dict = playlist_item.get_dictionary()
        vote = VotingService.find_list_vote(user_id, playlist_item)

        return ItemService._decorate_with_value(ItemService._decorate_item_with_vote(item_dict, vote), playlist_item)

    @staticmethod
    def convert_from_query_item_and_decorate_item_user_voted(item, user_id=None):
        if not user_id or user_id == "NO_CID":
            return ItemService._decorate_with_value(item.get_dictionary(), item)

        from src.services.voting_service import VotingService
        item_dict = item.get_dictionary()
        my_vote = VotingService.find_item_vote(user_id, item)

        return ItemService._decorate_with_value(ItemService._decorate_item_with_vote(item_dict, my_vote), item)

    @staticmethod
    def _decorate_item_with_vote(item_dict, vote):
        if vote:
            if vote.value == '':
                item_dict['user_vote'] = 0
            else:
                item_dict['user_vote'] = int(vote.value)
        else:
            item_dict['user_vote'] = 0

        return item_dict

    @staticmethod
    def get_internal_item(data):
        item_id = data.get("id")
        item = MediaItem.get_item_with_id(item_id)
        if item:
            return item
        else:
            return PlaylistItem.get_item_with_id(item_id)

    @staticmethod
    def _decorate_with_value(item_dict, item):
        value = item.value

        if hasattr(value, '__call__'):
            value = value()

        if not value or value == '':
            item_dict['value'] = 0
        else:
            item_dict['value'] = int(float(value))

        return item_dict
