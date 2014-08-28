from peewee import *
from src.models.base import BaseModel, EnumField
from src.models.media_item import MediaItem

ALLOWED_VALUES = [-1, 1]


class VoteError(Exception):
    pass


class Vote(BaseModel):

    item = ForeignKeyField(MediaItem)
    value = EnumField(default=0).values(ALLOWED_VALUES)
    cid = CharField()

    @staticmethod
    def create_vote(item, value, cid):
        query = Vote.select().where(
            (Vote.item == item) &
            (Vote.cid == cid)
        )

        vote = query.first() or Vote(item=item, cid=cid)
        vote.value = value
        vote.deleted = False

        return vote
