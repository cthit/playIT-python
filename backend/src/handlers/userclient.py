from src.handlers.base import *
from src.models.media_item import MediaItem, MediaItemError
from src.models.playlist_item import PlaylistItem, PlaylistItemError
from src.models.vote import Vote, PlaylistVote
from src.utils.memcache import RedisMemcache
from src.models.base import *
import logging
import json

SETTINGS = "SETTINGS"
ITEM = "MEDIA_ITEM"
LIST = "MEDIA_LIST"
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

    def action_get_playlist_queue(self, data):
        return LIST+"/"+QUEUE+UPDATE, PlaylistItem.get_queue(), self.format_media_item

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

        if "list" in media_type:
            try:
                item = PlaylistItem.create_media_item(cid, media_type, external_id)
                item.save()
                self.add_vote(cid, item, data)
            except MediaItemError as e:
                msg = "Failed to save %s due to: %s" % (data, e)
                logging.error(msg)
                return LIST+NEW+FAIL, msg
        else:
            try:
                item = MediaItem.create_media_item(cid, media_type, external_id)
                item.save()
                self.add_vote(cid, item, data)
            except MediaItemError as e:
                msg = "Failed to save %s due to: %s" % (data, e)
                logging.error(msg)
                return ITEM+NEW+FAIL, msg

        self.send(ITEM+NEW, item)
        if self._current_item:
            from src.handlers.playbackclient import PlaybackClient
            self.broadcast(ITEM+NEW, item, client_type=PlaybackClient)
        self.broadcast(QUEUE+UPDATE, MediaItem.get_queue(), formater=self.format_media_item, client_type=UserClient)

        return ITEM+NEW+SUCCESS, ""

    @Authorized()
    def action_add_vote(self, data):
        item = self.get_item(data)

        cid = self.get_cid()

        if item:
            self.add_vote(cid, item, data)
            item.check_value()
            item_uri = ITEM

            if item.deleted:
                self.broadcast(self.get_item_uri(item)+DELETE, item, client_type=type(self))
            else:
                self.broadcast(self.get_item_uri(item)+UPDATE, item.with_value(),
                               formater=self.format_media_item, client_type=type(self))

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

    @Authorized()
    def action_remove_item(self, data):
        item = self.get_item(data)
        if not item:
            return ITEM+DELETE+FAIL, ""

        if self._user.get("cid") == item.cid or ADMIN_GROUP in self._user.get("groups"):
            item.delete_instance()
            return self.get_item_uri(item)+DELETE+SUCCESS, item
        else:
            raise AuthenticationError("Not your item to delete and you're not admin")

    @Authorized(group=ADMIN_GROUP)
    def action_set_limit(self, data):
        media_type = data.get("type")
        if not media_type:
            return SETTINGS+UPDATE+FAIL, "Missing media_type"

        limit = data.get("limit")
        if not limit:
            return SETTINGS+UPDATE+FAIL, "Missing limit"

        (success, limit) = MediaItem.change_limit(media_type, limit)
        if success:
            return SETTINGS+UPDATE+SUCCESS, "Limit for %s update to %s" % (media_type, limit)
        else:
            return SETTINGS+UPDATE+FAIL, "Limit not update for %s" % media_type



    @staticmethod
    def get_item(data):
        external_id = data.get("id", "NO_ID_SUPPLIED")
        media_type = data.get("type", "NO_TYPE_SUPPLIED")

        if "list" in media_type:
            item = PlaylistItem.get_item(media_type, external_id)
        else:
            item = MediaItem.get_item(media_type, external_id)

        return item

    @staticmethod
    def add_vote(cid, item, data):
        vote_value = data.get("vote", 1)
        if "list" in item.type:
            vote = PlaylistVote.create_vote(cid=cid, value=vote_value, item=item)
        else:
            vote = Vote.create_vote(cid=cid, value=vote_value, item=item)

        vote.save()

        return vote

    @staticmethod
    def remove_vote(cid, item):
        if "list" in item.type:
            vote = PlaylistVote.fetch().where(
                (Vote.cid == cid) &
                (Vote.item == item)
            ).first()
        else:
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

    @staticmethod
    def get_item_uri(item):
        item_uri = ITEM
        if "list" in item.type:
            item_uri = LIST

        return item_uri


handlers = [
    (r'/ws/action', UserClient)
]