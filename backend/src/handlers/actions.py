from src.handlers.base import BaseHandler
from src.models.media_item import MediaItem, MediaItemError
from src.models.vote import Vote
from src.models.base import *
import logging
import json


class Actions(BaseHandler):

    def action_derp(self, data):
        logging.info("We got stuff to derp %r" % data)
        return "We did good"

    def action_herp(self, data):
        logging.info("We got stuff to herp %r" % data)
        return "We did great"

    def action_all(self, data):
        logging.info("Derp")
        self.broadcast("Hello clientsssszzzzz")

    def action_add_item(self, data):
        external_id = data.get("id", "NO_ID_SUPPLIED")
        media_type = data.get("type", "NO_TYPE_SUPPLIED")
        cid = "johandf"
        item = MediaItem.create_media_item(cid, media_type, external_id)

        try:
            item.save()
            self.add_vote(cid, item, data)
        except MediaItemError as e:
            msg = "Failed to save %s due to: %s" % (data, e)
            logging.error(msg)
            return msg

        self.write_message(item)

        self.broadcast(MediaItem.get_queue())

        return "action_add_item:success"

    def action_add_vote(self, data):
        item = self.get_item(data)
        cid = "johandf"

        if item:
            vote = self.add_vote(cid, item, data)
            self.write_message(vote)
            item.check_value()
            return "action_add_vote:success"
        else:
            return "No such item %s" % data.get("id", "NO_ID_SUPPLIED")

    def action_remove_vote(self, data):
        item = self.get_item(data)
        cid = "johandf"
        if self.remove_vote(cid, item):
            return "Success: removed vote for %s" % item.title
        else:
            return "No such item: %s" % data.get("id", "NO_ID_SUPPLIED")

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

    @staticmethod
    def action_get_queue(data):
        return MediaItem.get_queue()


handlers = [
    (r'/ws/action', Actions)
]