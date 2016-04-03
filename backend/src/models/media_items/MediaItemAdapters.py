from src.services.youtube_service import YoutubeService
from src.services.spotify_service import SpotifyService
from src.services.soundcloud_service import SoundcloudService


class YoutubeMediaItemAdapter(object):

    @staticmethod
    def create_item(item):
        return YoutubeService.video(item.external_id)


class SoundcloudMediaItemAdapter(object):

    @staticmethod
    def create_item(item):
        return SoundcloudService.get_track(item.external_id)


class SpotifyMediaItemAdapter(object):

    @staticmethod
    def create_item(item):
        return SpotifyService.get_track(item.external_id)