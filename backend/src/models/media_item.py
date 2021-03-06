import importlib
from peewee import CharField, IntegerField, TextField, fn
from src.services.user_service import UserService
from src.models.base import BaseModel
from tornado.options import options

YOUTUBE = "youtube"
SPOTIFY = "spotify"
SOUNDCLOUD = "soundcloud"

VOTE_LIMIT = -2
DURATION_LIMIT_MAP = {
    YOUTUBE: 60 * 60 * 3,  # 3 hour
    SPOTIFY: 60 * 60,  # 1 hour
    SOUNDCLOUD: 60 * 60,  # 1 hour
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
    author = CharField(default="", null=True)
    description = TextField(default="", null=True)
    thumbnail = CharField(default="", null=True)
    cid = CharField()
    nick = CharField(null=True)
    type = CharField()
    external_id = CharField()
    duration = IntegerField(null=True)
    album = CharField(null=True)
    permalink_url = CharField(null=True)

    def exists(self):
        return MediaItem.fetch().where(
            MediaItem.external_id == self.external_id,
            MediaItem.type == self.type
        ).exists()

    def save(self, *args, **kwargs):
        allowed_duration = DURATION_LIMIT_MAP.get(self.type)
        if self.duration > allowed_duration:
            raise MediaItemError(u"duration {0:d} is longer then allowed {1:d}".format(self.duration, allowed_duration))

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

        return query.first()

    def delete_instance(self, permanently=False, recursive=False, delete_nullable=False):
        from src.models.vote import Vote
        Vote.delete(permanently=True).where(Vote.item == self.id).execute()

        return super(MediaItem, self).delete_instance(permanently, recursive, delete_nullable)

    @staticmethod
    def get_item(media_type, external_id, user_id=None):
        item = MediaItem.fetch().where(
            (MediaItem.external_id == external_id) &
            (MediaItem.type == media_type)
        ).first()

        if user_id:
            item = MediaItem.decorate_with_self_voted(item, user_id)

        return item

    @staticmethod
    def get_item_with_id(item_id):
        return MediaItem.fetch().where(MediaItem.id == item_id).first()

    @staticmethod
    def create_media_item(cid, media_type, external_id):
        creator = MediaItem.get_creator(media_type)
        item = MediaItem()
        item.external_id = external_id
        item.type = media_type

        if item.exists():
            raise MediaItemError("Item already exists")

        item_dict = creator(item)

        item.title = item_dict.get("title")
        item.author = item_dict.get('author')
        item.thumbnail = item_dict.get("thumbnail", "")
        item.item_count = item_dict.get("item_count")
        item.duration = item_dict.get("duration")
        item.permalink_url = item_dict.get("permalink_url")

        user = UserService.get_user_by_id(cid)
        item.cid = cid
        if user:
            item.nick = user.get("nick", "")

        return item

    @staticmethod
    def get_creator(media_type):
        # noinspection PyPep8Naming
        Klass = MediaItem.get_class(media_type)
        return getattr(Klass, "create_item")

    @staticmethod
    def get_class(media_type):
        mod = importlib.import_module('src.models.media_items.MediaItemAdapters')
        klass_name = media_type.capitalize() + 'MediaItemAdapter'
        return getattr(mod, klass_name)

    @staticmethod
    def valid_user(cid):
        # TODO, proper check
        return isinstance(cid, str) and len(cid) > 0

    @staticmethod
    def get_queue():
        from src.models.vote import Vote
        items = MediaItem.fetch(
            MediaItem, fn.Sum(Vote.value).alias("value")
        ).join(Vote).group_by(MediaItem.external_id) \
            .order_by(fn.Sum(Vote.value).desc(), MediaItem.created_at)

        return items

    @staticmethod
    def change_limit(media_type, limit):
        if DURATION_LIMIT_MAP.get(media_type):
            DURATION_LIMIT_MAP[media_type] = limit
            return True, limit
        else:
            return False, -1
