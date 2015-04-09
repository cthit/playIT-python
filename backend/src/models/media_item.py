import requests
import logging
import isodate
from peewee import CharField, IntegerField, fn
from src.utils.auth import Auth
from src.models.base import BaseModel
from tornado.options import options

YOUTUBE = "youtube"
SPOTIFY = "spotify"
SOUNDCLOUD = "soundcloud"

VOTE_LIMIT = -2
DURATION_LIMIT_MAP = {
    YOUTUBE: 60*60*3,  # 3 hour
    SPOTIFY: 60*60,  # 1 hour
    SOUNDCLOUD: 60*60,  # 1 hour
}

YOUTUBE_URL = "https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&id=%s&fields=items&key="
SOUNDCLOUD_URL = "http://api.soundcloud.com/tracks/%s.json?client_id="

URL_MAP = {
    YOUTUBE: "%s%s" % (YOUTUBE_URL, options.youtube_key),
    SPOTIFY: "http://ws.spotify.com/lookup/1/.json?uri=spotify:track:%s",
    SOUNDCLOUD: "%s%s" % (SOUNDCLOUD_URL, options.soundcloud_key)
}


class MediaItemError(Exception):
    pass


class MediaItem(BaseModel):

    title = CharField(default="")
    author = CharField(default="")
    description = CharField(default="")
    thumbnail = CharField(default="")
    cid = CharField()
    nick = CharField()
    type = CharField()
    external_id = CharField()
    duration = IntegerField()
    album = CharField(null=True)

    def exists(self):
        return MediaItem.fetch().where(
            MediaItem.external_id == self.external_id,
            MediaItem.type == self.type
        ).exists()

    def save(self, *args, **kwargs):
        allowed_duration = DURATION_LIMIT_MAP.get(self.type)
        if self.duration > allowed_duration:
            raise MediaItemError("duration %d is longer then allowed %d" % (self.duration, allowed_duration))

        super(MediaItem, self).save(*args, **kwargs)

    def _get_votes(self):
        from src.models.vote import Vote
        vote = Vote.fetch(
            fn.Sum(Vote.value).alias("value")
        ).where(Vote.item == self).first()

        return vote

    def check_value(self):
        from src.models.vote import Vote
        votes = self._get_votes()

        if votes and votes.value and float(votes.value) <= VOTE_LIMIT:
            Vote.delete(permanently=True).where(Vote.item == self).execute()
            self.delete_instance()

    def value(self):
        vote = self._get_votes()
        if vote and vote.value:
            return float(vote.value)
        else:
            return 0.0

    def with_value(self):
        from src.models.vote import Vote
        query = MediaItem.fetch(
            MediaItem, fn.Sum(Vote.value).alias("value")
        ).where(
            MediaItem.id == self.id
        ).join(Vote).group_by(MediaItem.external_id).order_by(fn.Sum(Vote.value).desc())

        item = query.first()
        item_dict = item.get_dictionary()
        item_dict["value"] = item.value

        return item_dict

    def delete_instance(self, permanently=False, recursive=False, delete_nullable=False):
        from src.models.vote import Vote
        Vote.delete(permanently=True).where(Vote.item == self.id).execute()

        return super(MediaItem, self).delete_instance(permanently, recursive, delete_nullable)

    @staticmethod
    def get_item(media_type, external_id):
        return MediaItem.fetch().where(
            (MediaItem.external_id == external_id) &
            (MediaItem.type == media_type)
        ).first()

    @staticmethod
    def create_media_item(cid, media_type, external_id):
        creator = getattr(MediaItem, "create_" + media_type + "_item")
        item = MediaItem()
        item.external_id = external_id
        item.type = media_type

        if item.exists():
            raise MediaItemError("Item already exists")

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
    def create_youtube_item(item, data):
        entry = data.get("items")[0]
        item = MediaItem.parse_youtube_entry(item, entry)

        return item

    @staticmethod
    def parse_youtube_entry(item, entry):
        snippet = entry.get("snippet")
        item.title = snippet.get("title")
        item.author = snippet.get("channelTitle")
        item.description = snippet.get("description")
        item.thumbnail = MediaItem.best_thumbnail(snippet.get("thumbnails"))

        try:
            duration_raw = entry.get("contentDetails").get("duration")
            duration_parsed = isodate.parse_duration(duration_raw)
            item.duration = int(duration_parsed.total_seconds())
        except(ValueError, TypeError):
            item.duration = 1337

        return item

    @staticmethod
    def best_thumbnail(thumbnail):
        keys = ["maxres", "standard", "high", "medium", "default"]
        for key in keys:
            item = thumbnail.get(key)
            if(item):
                return item.get("url")

    @staticmethod
    def create_spotify_item(item, data):
        data = data.get("track")

        item.title = data.get("name")
        item.author = ", ".join((a.get("name") for a in data.get("artists")))
        item.album = data.get("album").get("name")
        try:
            item.duration = int(data.get("length") + 0.5)
        except (TypeError, ValueError):
            logging.error("Failed to get duration for spotify item")
            item.duration = 1337

        thumbnail_url = "https://embed.spotify.com/oembed/?url=spotify:track:%s" % item.external_id
        thumbnail_resp = requests.get(thumbnail_url)
        thumbnail_data = thumbnail_resp.json()

        item.thumbnail = thumbnail_data.get("thumbnail_url")

        return item

    @staticmethod
    def create_soundcloud_item(item, data):
        item.title = data.get("title")
        item.author = data.get("user").get("username")
        item.thumbnail = data.get("artwork_url")
        item.duration = int(data.get("duration")/1000 + 0.5)

        return item

    @staticmethod
    def valid_user(cid):
        # TODO, proper check
        return isinstance(cid, str) and len(cid) > 0

    @staticmethod
    def get_queue():
        from src.models.vote import Vote
        return MediaItem.fetch(
            MediaItem, fn.Sum(Vote.value).alias("value")
        ).join(Vote).group_by(MediaItem.external_id).order_by(fn.Sum(Vote.value).desc(), MediaItem.created_at)

    @staticmethod
    def change_limit(media_type, limit):
        if DURATION_LIMIT_MAP.get(media_type):
            DURATION_LIMIT_MAP[media_type] = limit
            return True, limit
        else:
            return False, -1
