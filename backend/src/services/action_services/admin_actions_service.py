import logging

from src.models.media_item import MediaItem


class AdminActionsService(object):

    @staticmethod
    def change_limit(media_type, limit):
        return MediaItem.change_limit(media_type, limit)

