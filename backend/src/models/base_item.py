from peewee import CharField
from src.models.base import BaseModel


class MediaItemError(Exception):
    pass


class BaseItem(BaseModel):

    title = CharField(default="")
    author = CharField(default="")
    description = CharField(default="")
    thumbnail = CharField(default="")
    cid = CharField()
    nick = CharField()
    type = CharField()
    external_id = CharField()

    def exists(self):
        return BaseItem.fetch().where(
            BaseItem.external_id == self.external_id,
            BaseItem.type == self.type
        ).exists()

    @staticmethod
    def _get_votes():
        raise Exception("SUBCLASS SHOULD IMPLEMENT THIS")

    def value(self):
        vote = self._get_votes()
        if vote:
            return float(vote.value)
        else:
            return 0.0

    @staticmethod
    def get_item(media_type, external_id):
        return BaseItem.fetch().where(
            (BaseItem.external_id == external_id) &
            (BaseItem.type == media_type)
        ).first()
