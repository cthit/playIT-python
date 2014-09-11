from src.handlers.base import *
from src.models.media_item import MediaItem, MediaItemError
from src.models.vote import Vote
from src.utils.memcache import RedisMemcache
from src.models.base import *
import logging
import json

ITEM = "MEDIA_ITEM"
QUEUE = "QUEUE"
VOTE = "VOTE"
PLAYING = "PLAYING"


class UserClient(BaseHandler):

    _current_item = None

    @staticmethod
    def format_media_item(item):
        value = item.get("value")
        if value == '':
            value = '0'
        item["value"] = int(float(value))

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

        return ITEM+NEW+SUCCESS, ""

    @Authorized()
    def action_add_vote(self, data):
        item = self.get_item(data)

        cid = self.get_cid()

        if item:
            self.add_vote(cid, item, data)
            item.check_value()
            if item.deleted:
                self.broadcast(ITEM+DELETE, item)
            else:
                self.broadcast(ITEM+UPDATE, item.with_value(), formater=self.format_media_item)

            return VOTE+NEW+SUCCESS, ""
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

    def action_get_current(self, data):
        return PLAYING+STATUS, self._current_item

    @staticmethod
    def get_item(data):
        external_id = data.get("id", "NO_ID_SUPPLIED")
        media_type = data.get("type", "NO_TYPE_SUPPLIED")

        item = MediaItem.get_item(media_type, external_id)

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

    @staticmethod
    def set_current(item):
        UserClient._current_item = item
        UserClient.broadcast(PLAYING+STATUS, item)

handlers = [
    (r'/ws/action', UserClient)
]