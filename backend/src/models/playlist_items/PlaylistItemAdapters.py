from src.services.integration_services.soundcloud_service import SoundcloudService
from src.services.integration_services.spotify_oauth_service import SpotifyOauthService

from src.cache import cache
from src.models.playlist_item import PlaylistItemError
from src.services.integration_services.spotify_service import SpotifyService
from src.services.integration_services.youtube_service import YoutubeService


class YoutubePlaylistItemAdapter(object):
    @staticmethod
    def create_item(item):
        playlist_item = YoutubeService.get_playlist_item(playlist_id=item.external_id)
        YoutubePlaylistItemAdapter.cache_list(item.external_id)

        return playlist_item

    @staticmethod
    def cache_list(playlist_id):
        video_ids = YoutubeService.playlist_items_ids(playlist_id)
        videos = YoutubeService.videos(video_ids)
        cache.set(playlist_id, videos)


class SoundcloudPlaylistItemAdapter(object):
    @staticmethod
    def create_item(item):
        soundcloud_item = SoundcloudService.get_playlist(item.external_id)
        cache.set(item.external_id, soundcloud_item.get('tracks'))

        return soundcloud_item


class SpotifyPlaylistItemAdapter(object):
    @staticmethod
    def create_item(item):
        id_parts = item.external_id.split(':')
        token = SpotifyOauthService.get_token(item.cid)
        if token:
            playlist = SpotifyService.get_playlist(token, id_parts[2], id_parts[4])
            cache.set(item.external_id, playlist.get('tracks'))
            return playlist
        else:
            raise PlaylistItemError("Not authorized with spotify")
