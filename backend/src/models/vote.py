from peewee import *
from src.models.base import BaseModel, EnumField
from src.models.media_item import MediaItem

ALLOWED_VALUES = [-1, 1]


class Vote(BaseModel):

    item = ForeignKeyField(MediaItem)
    value = EnumField(default=0).values(ALLOWED_VALUES)
    cid = CharField()