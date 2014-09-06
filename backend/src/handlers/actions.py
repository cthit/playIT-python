from src.handlers.base import BaseHandler, Authorized
from src.models.media_item import MediaItem, MediaItemError
from src.models.vote import Vote
from src.utils.memcache import RedisMemcache
from src.models.base import *
import logging
import json

SUCCESS = "/SUCCESS"
FAIL = "/FAIL"
UPDATE = "/UPDATE"
DELETE = "/DELETE"
NEW = "/NEW"

ITEM = "MEDIA_ITEM"
QUEUE = "QUEUE"
VOTE = "VOTE"


class Actions(BaseHandler):

    @staticmethod
    def format_media_item(item):
        item["value"] = int(float(item.get("value")))
        return item

    def action_get_queue(self, data):
        return QUEUE+UPDATE, MediaItem.get_queue(), self.format_media_item

    def get_cid(self):
        user = RedisMemcache.get("token:"+self._token)
        if user:
            return user.get("cid")
        else:
            return "NO_CID"

    @Authorized()
    def action_add_item(self, data):
        external_id = data.get("id", "NO_ID_SUPPLIED")
        media_type = data.get("type", "NO_TYPE_SUPPLIED")
        cid = self.get_cid()

        try:
            item = MediaItem.create_media_item(cid, media_type, external_id)
            item.save()
            self.add_vote(cid, item, data)
        except MediaItemError as e:
            msg = "Failed to save %s due to: %s" % (data, e)
            logging.error(msg)
            return ITEM+NEW+FAIL, msg

        self.send(ITEM+NEW, item)
        self.broadcast(QUEUE+UPDATE, MediaItem.get_queue(), formater=self.format_media_item)

        return ITEM+NEW+SUCCESS

    @Authorized()
    def action_add_vote(self, data):
        item = self.get_item(data)

        cid = self.get_cid()

        if item:
            vote = self.add_vote(cid, item, data)
            self.send(VOTE+NEW, vote)
            item.check_value()
            return VOTE+NEW+SUCCESS
        else:
            return VOTE+NEW+FAIL, "No such item %s" % data.get("id", "NO_ID_SUPPLIED")

    @Authorized()
    def action_remove_vote(self, data):
        item = self.get_item(data)
        cid = self.get_cid()
        if self.remove_vote(cid, item):
            return VOTE+DELETE+SUCCESS, "Success: removed vote for %s" % item.title
        else:
            return VOTE+DELETE+FAIL, "No such item: %s" % data.get("id", "NO_ID_SUPPLIED")


    @staticmethod
    def get_item(data):
        external_id = data.get("id", "NO_ID_SUPPLIED")
        media_type = data.get("type", "NO_TYPE_SUPPLIED")

        item = MediaItem.fetch().where(
            (MediaItem.external_id == external_id) &
            (MediaItem.type == media_type)
        ).first()

        return item

    @staticmethod
    def add_vote(cid, item, data):
        vote_value = data.get("vote", 1)
        vote = Vote.create_vote(cid=cid, value=vote_value, item=item)
        vote.save()

        return vote

    @staticmethod
    def remove_vote(cid, item):
        vote = Vote.fetch().where(
            (Vote.cid == cid) &
            (Vote.item == item)
        ).first()

        if vote:
            vote.delete_instance()
            return True
        else:
            return False


handlers = [
    (r'/ws/action', Actions)
]