import requests
from tornado.options import options
from peewee import CharField, IntegerField, fn
from src.utils.auth import Auth
from src.models.base import BaseModel
from src.models.media_item import MediaItem
from src.utils.memcache import RedisMemcache
from src.services.youtube_service import YoutubeService
from src.services.soundcloud_service import SoundcloudService

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

        if votes and float(votes.value) <= VOTE_LIMIT:
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
        creator = getattr(PlaylistItem, "create_" + media_type + "_item")
        item = PlaylistItem()
        item.external_id = external_id
        item.type = media_type

        if item.exists():
            raise PlaylistItemError("Item already exists")

        item_dict = creator(item, data)
        item.title = item_dict.get("title")
        item.author = item_dict.get('author')
        item.thumbnail = item_dict.get("thumbnail")
        item.item_count = item_dict.get("item_count")

        user = Auth.get_user(cid)
        item.cid = cid
        if user:
            item.nick = user.get("nick", "")

        return item

    @staticmethod
    def create_youtube_list_item(item):
        playlist_item = YoutubeService.get_playlist_item(playlist_id=item.external_id)
        PlaylistItem.cache_youtube_list(item.external_id)

        return playlist_item

    @staticmethod
    def cache_youtube_list(playlist_id):
        video_ids = YoutubeService.playlist_items_ids(playlist_id)
        videos = YoutubeService.videos(video_ids)
        RedisMemcache.set(playlist_id, videos)

    @staticmethod
    def create_soundcloud_item(item):
        soundcloud_item = SoundcloudService.get_playlist(item.external_id)
        RedisMemcache.set(item.external_id, soundcloud_item.get('tracks'))

        return soundcloud_item

    @staticmethod
    def create_spotify_list_item(item, data):
        pass

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
            cacher = getattr(PlaylistItem, "cache_" + media_type)
            cacher(external_id)
            return RedisMemcache.get(external_id)

    @staticmethod
    def get_index(playlist, index):
        items = PlaylistItem._retrieve_cache(external_id, playlist.type)
        if not items:
            return

        index = index % len(items)
        item = items[index]
        if item:
            item["type"] = playlist.type[:-5]
            item["nick"] = playlist.nick
            print(item)

        return item
