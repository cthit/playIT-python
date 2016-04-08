from peewee import ForeignKeyField, CharField

from src.models.base import BaseModel
from src.models.fields.enum_field import EnumField
from src.models.media_item import MediaItem
from src.models.playlist_item import PlaylistItem

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


class PlaylistVote(BaseModel):

    item = ForeignKeyField(PlaylistItem)
    value = EnumField(default=0).values(ALLOWED_VALUES)
    cid = CharField()

    @staticmethod
    def create_vote(item, value, cid):
        query = PlaylistVote.select().where(
            (PlaylistVote.item == item) &
            (PlaylistVote.cid == cid)
        )

        vote = query.first() or PlaylistVote(item=item, cid=cid)
        vote.value = value
        vote.deleted = False

        return vote
