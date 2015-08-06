import requests
from tornado.options import options
from peewee import CharField, IntegerField, fn
from src.utils.auth import Auth
from src.models.base import BaseModel
from src.models.media_item import MediaItem
from src.utils.memcache import RedisMemcache
from src.services.youtube_service import YoutubeService

YOUTUBE_LIST_ITEM = "youtube_list_item"
SPOTIFY_LIST = "spotify_list"
YOUTUBE_LIST = "youtube_list"

VOTE_LIMIT = -2

YOUTUBE_LIST_ITEM_URL = "https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=PLFF3F248AC60CF19E&key="
YOUTUBE_LIST_URL = "https://www.googleapis.com/youtube/v3/playlists?part=snippet,contentDetails&id=%s&key="
YOUTUBE_KEY = options.youtube_key

URL_MAP = {
    YOUTUBE_LIST_ITEM: "%s%s" % (YOUTUBE_LIST_ITEM_URL, options.youtube_key),
    YOUTUBE_LIST: "%s%s" % (YOUTUBE_LIST_URL, options.youtube_key),
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

        url = URL_MAP.get(media_type) % external_id
        response = requests.get(url)
        data = response.json()

        item = creator(item, data)
        user = Auth.get_user(cid)
        item.cid = cid
        if user:
            item.nick = user.get("nick", "")

        return item

    @staticmethod
    def create_youtube_list_item(item, data):
        entry = data.get("items")[0]
        snippet = entry.get("snippet")
        item.title = snippet.get("title")
        item.author = ""  # TODO at some point mayhaps
        thumbnail = snippet.get("thumbnails")
        item.thumbnail = MediaItem.best_thumbnail(thumbnail)
        item.item_count = entry.get("contentDetails").get("itemCount")
        PlaylistItem.cache_youtube_list(item.external_id)

        return item

    @staticmethod
    def cache_youtube_list(playlist_id):
        video_ids = YoutubeService.playlist_items_ids(playlist_id)
        videos = YoutubeService.videos(video_ids)
        RedisMemcache.set(playlist_id, videos)

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
    def get_index(playlist, index):
        media_type = playlist.type
        external_id = playlist.external_id

        retriever = getattr(PlaylistItem, "get_index_" + media_type)

        return retriever(external_id, index)

    @staticmethod
    def _retrieved_youtube_cache(external_id):
        videos = RedisMemcache.get(external_id)
        if not videos:
            PlaylistItem.cache_youtube_list(external_id)

        return RedisMemcache.get(external_id)

    @staticmethod
    def get_index_youtube_list(external_id, index):
        playlist = PlaylistItem.fetch().where(PlaylistItem.external_id == external_id).first()
        videos = PlaylistItem._retrieved_youtube_cache(external_id)
        if not videos or not playlist:
            return

        index = index % len(videos)
        item = videos[index]
        if item:
            item["type"] = "youtube"
            item["nick"] = playlist.nick
            print(item)

        return item
