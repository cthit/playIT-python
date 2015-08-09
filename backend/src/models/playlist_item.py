import requests
import importlib
from tornado.options import options
from peewee import CharField, IntegerField, fn
from src.utils.auth import Auth
from src.models.base import BaseModel
from src.models.media_item import MediaItem
from src.utils.memcache import RedisMemcache

SPOTIFY_LIST = "spotify_list"

VOTE_LIMIT = -2

URL_MAP = {
    SPOTIFY_LIST: "",  # Spotify requires api key and authorization
}



class PlaylistItemError(Exception):
    pass


class PlaylistItem(BaseModel):

    title = CharField(default="")
    author = CharField(default="")
    description = CharField(default="")
    thumbnail = CharField(default="")
    cid = CharField()
    nick = CharField()
    type = CharField()
    external_id = CharField()
    item_count = IntegerField()

    def exists(self):
        return PlaylistItem.fetch().where(
            PlaylistItem.external_id == self.external_id,
            PlaylistItem.type == self.type
        ).exists()

    def _get_votes(self):
        from src.models.vote import Vote
        vote = Vote.fetch(
            fn.Sum(Vote.value).alias("value")
        ).where(Vote.item == self).first()

        return vote

    def check_value(self):
        from src.models.vote import PlaylistVote
        votes = self._get_votes()

        if votes and votes.value and float(votes.value) <= VOTE_LIMIT:
            PlaylistVote.delete(permanently=True).where(PlaylistVote.item == self).execute()
            self.delete_instance()

    def value(self):
        vote = self._get_votes()
        if vote:
            return float(vote.value)
        else:
            return 0.0

    def with_value(self):
        from src.models.vote import PlaylistVote
        query = PlaylistItem.fetch(
            PlaylistItem, fn.Sum(PlaylistVote.value).alias("value")
        ).where(
            PlaylistItem.id == self.id
        ).join(PlaylistVote).group_by(PlaylistItem.external_id).order_by(fn.Sum(PlaylistVote.value).desc())

        item = query.first()
        item_dict = item.get_dictionary()
        item_dict["value"] = item.value

        return item_dict

    def delete_instance(self, permanently=False, recursive=False, delete_nullable=False):
        from src.models.vote import PlaylistVote
        PlaylistVote.delete(permanently=True).where(PlaylistVote.item == self.id).execute()

        return super(PlaylistItem, self).delete_instance(permanently, recursive, delete_nullable)

    @staticmethod
    def get_item(media_type, external_id):
        return PlaylistItem.fetch().where(
            (PlaylistItem.external_id == external_id) &
            (PlaylistItem.type == media_type)
        ).first()

    @staticmethod
    def create_media_item(cid, media_type, external_id):
        creator = PlaylistItem.get_creator(media_type)

        item = PlaylistItem()
        item.external_id = external_id
        item.type = media_type

        if item.exists():
            raise PlaylistItemError("Item already exists")

        item_dict = creator(item)
        item.title = item_dict.get("title")
        item.author = item_dict.get('author')
        item.thumbnail = item_dict.get("thumbnail", "")
        item.item_count = item_dict.get("item_count")

        user = Auth.get_user(cid)
        item.cid = cid
        if user:
            item.nick = user.get("nick", "")

        return item

    @staticmethod
    def get_creator(media_type):
        Klass = PlaylistItem.get_class(media_type)
        return getattr(Klass, "create_item")

    @staticmethod
    def get_class(media_type):
        mod = importlib.import_module('src.models.playlist_items.PlaylistItemAdapters')
        klass_name = media_type[:-5].capitalize() + 'PlaylistItemAdapter'
        return getattr(mod, klass_name)


    @staticmethod
    def get_cacher(media_type):
        Klass = PlaylistItem.get_class(media_type)
        return getattr(Klass, "cache_list")

    @staticmethod
    def valid_user(cid):
        # TODO, proper check
        return isinstance(cid, str) and len(cid) > 0

    @staticmethod
    def get_queue():
        from src.models.vote import PlaylistVote
        return PlaylistItem.fetch(
            PlaylistItem, fn.Sum(PlaylistVote.value).alias("value")
        ).join(PlaylistVote).group_by(PlaylistItem.external_id)\
            .order_by(fn.Sum(PlaylistVote.value).desc(), PlaylistItem.created_at)

    @staticmethod
    def _retrieve_cache(external_id, media_type):
        items = RedisMemcache.get(external_id)
        if items:
            return items
        else:
            cacher = PlaylistItem.get_cacher(media_type)
            cacher(external_id)
            return RedisMemcache.get(external_id)

    @staticmethod
    def get_index(playlist, index):
        print(index)
        items = PlaylistItem._retrieve_cache(playlist.external_id, playlist.type)
        if not items:
            return

        index = index % len(items)
        print(len(items))
        item = items[index]
        if item:
            item["type"] = playlist.type[:-5]
            item["nick"] = playlist.nick
            print(item)

        return item
