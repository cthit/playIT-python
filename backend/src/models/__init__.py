import logging
import peewee
from tornado.options import options
from src.models.vote import Vote, PlaylistVote
from src.models.media_item import MediaItem
from src.models.playlist_item import PlaylistItem

__all__ = (
    'MediaItem', 'Vote'
)

models = [MediaItem, PlaylistItem, Vote, PlaylistVote]

if options.create_tables or None:
    for model in models:
        try:
            model.create_table()
        except peewee.OperationalError as e:
            logging.warning("Create tables: Operational error: %s" % e)
        except peewee.IntegrityError as e:
            logging.error("Create tables: %s" % e)
        except peewee.InternalError as e:
            logging.error("Create tables: Internal error: %s" % e)
