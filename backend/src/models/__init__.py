import logging
import peewee
from tornado.options import options
from src.models.vote import Vote
from src.models.media_item import MediaItem

__all__ = (
    'MediaItem', 'Vote'
)

models = [MediaItem, Vote]

if options.create_tables or None:
    for model in models:
        try:
            model.create_table()
        except peewee.OperationalError as e:
            logging.error("Create tables: Operational error: %s" % e)
        except peewee.IntegrityError as e:
            logging.error("Create tables: %s" % e)