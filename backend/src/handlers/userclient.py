from src.handlers.base import Authorized, BaseHandler, ADMIN_GROUP, AuthenticationError
from src.models.media_item import MediaItem
from src.models.playlist_item import PlaylistItem
from src.utils.memcache import RedisMemcache
from src.services.spotify_oauth_service import SpotifyOauthService
from src.services.user_client_actions_service import UserClientActionsService
from src.services.voting_service import VotingService
from src.services.admin_actions_service import AdminActionsService
from src.services.item_service import ItemService
from src.services.clients_service import ClientsService
from src.services.user_service import UserService

from src.constants import *
import logging


class UserClient(BaseHandler):

    def open(self):
        logging.info("UserClient opened new connection")
        super(BaseHandler, self).open()
        ClientsService.add_user_client(self)

    def close(self, *args, **kwargs):
        super(BaseHandler, self).close(args, kwargs)
        ClientsService.remove_user_client(self)

    def action_get_queue(self, data):
        user = None
        if not self._token:
            user = UserService.get_user(data.get("token"))

        cid = "NO_CID"
        if user:
            cid = user.get("cid")

        return QUEUE+UPDATE, UserClientActionsService.get_queue(cid)

    def action_get_playlist_queue(self, data):
        return LIST+"/"+QUEUE+UPDATE, UserClientActionsService.get_playlist_queue(self.get_cid())

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

        (success, msg, item) = UserClientActionsService.add_item(cid, data, external_id, media_type)

        if success:
            return ITEM + NEW, item
        else:
            return ITEM + NEW + FAIL, msg

    @Authorized()
    def action_add_vote(self, data):
        item = ItemService.get_internal_item(data)
        cid = self.get_cid()

        return VotingService.add_vote(cid, item, data)

    @Authorized()
    def action_remove_vote(self, data):
        item = ItemService.get_item(data)
        cid = self.get_cid()
        if VotingService.remove_vote(cid, item):
            return VOTE+DELETE+SUCCESS, "Success: removed vote for %s" % item.title
        else:
            return VOTE+DELETE+FAIL, "No such item: %s" % data.get("id", "NO_ID_SUPPLIED")

    def action_get_current(self, data):
        return PLAYING+STATUS, ItemService.get_current()

    @Authorized()
    def action_remove_item(self, data):
        item = ItemService.get_item(data)
        if not item:
            return ITEM+DELETE+FAIL, ""

        if self._user.get("cid") == item.cid or ADMIN_GROUP in self._user.get("groups"):
            UserClientActionsService.delete_item(item)
            return ItemService.get_item_uri(item)+DELETE+SUCCESS, item
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

        (success, limit) = AdminActionsService.change_limit(media_type, limit)
        if success:
            return SETTINGS+UPDATE+SUCCESS, "Limit for %s update to %s" % (media_type, limit)
        else:
            return SETTINGS+UPDATE+FAIL, "Limit not update for %s" % media_type

    @Authorized()
    def action_spotify_is_authorized(self, data):
        if SpotifyOauthService.get_token(self.get_cid()):
            return SPOTIFY_SERVICE+AUTHORIZED+SUCCESS, ""
        else:
            return SPOTIFY_SERVICE+AUTHORIZED+FAIL, "Not authorized with spotify"

    @Authorized()
    def action_get_spotify_authorize_url(self, data):
        return SPOTIFY_SERVICE+UPDATE+SUCCESS, SpotifyOauthService.get_authorize_uri()

    @Authorized()
    def action_spotify_auth(self, data):
        code = data.get("spotify_code")
        cid = self.get_cid()
        SpotifyOauthService.authorize(cid, code)

handlers = [
    (r'/ws/action', UserClient)
]
