import peewee
from peewee import *
from src.models.base import BaseModel


class MediaItem(BaseModel):

    title = CharField(default="")
    author = CharField(default="")
    description = CharField(default="")
    thumbnail = CharField(default="")
    cid = CharField()
    nick = CharField()
    type = CharField()
    external_id = CharField()
    length = IntegerField()

