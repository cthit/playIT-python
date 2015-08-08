from src.services.youtube_service import YoutubeService

class YoutubePlaylistItemAdapter(object):

	@staticmethod
	def create_item(item):
		playlist_item = YoutubeService.get_playlist_item(playlist_id=item.external_id)
        PlaylistItem.cache_youtube_list(item.external_id)

        return playlist_item

	@staticmethod
	def cache_list(playlist_id):
        video_ids = YoutubeService.playlist_items_ids(playlist_id)
        videos = YoutubeService.videos(video_ids)
        RedisMemcache.set(playlist_id, videos)


