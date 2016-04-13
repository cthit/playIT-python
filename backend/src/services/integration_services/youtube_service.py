#!/usr/bin/python3
import isodate
from tornado.options import options
from apiclient.discovery import build

YOUTUBE_KEY = options.youtube_key
YOUTUBE_API_SERVICE_NAME = "youtube"
YOUTUBE_API_VERSION = "v3"
YOUTUBE_MAX_RESULTS = 50
youtube = build(YOUTUBE_API_SERVICE_NAME, YOUTUBE_API_VERSION, developerKey=YOUTUBE_KEY)


class YoutubeService:
    @staticmethod
    def playlist_items_ids(playlist_id):

        search_request = youtube.playlistItems().list(
            playlistId=playlist_id,
            part="id,snippet",
            maxResults=50
        )

        videos = []

        while search_request is not None:
            search_response = search_request.execute()

            for v in search_response.get("items", []):
                videos.append(v['snippet']['resourceId']['videoId'])

            search_request = youtube.playlistItems().list_next(search_request, search_response)

        return videos

    @staticmethod
    def get_playlist_item(playlist_id):
        playlist_request = youtube.playlists().list(
            id=playlist_id,
            part="id,snippet,contentDetails"
        )

        if playlist_request:
            response = playlist_request.execute()
            playlist = response.get("items")[0]
            snippet = playlist.get('snippet')
            return dict(
                title=snippet.get('title'),
                author=snippet.get('channelTitle'),
                thumbnail=YoutubeService.best_thumbnail(snippet.get("thumbnails")),
                item_count=playlist.get('contentDetails').get('itemCount')
            )

    @staticmethod
    def _chunks(l, n):
        """Yield successive n-sized chunks from l."""
        for i in range(0, len(l), n):
            yield l[i:i + n]

    @staticmethod
    def video(video_id):
        videos = YoutubeService.videos([video_id])
        if videos:
            return videos[0]
        return dict()

    @staticmethod
    def videos(video_ids):
        chunks = YoutubeService._chunks(video_ids, YOUTUBE_MAX_RESULTS)
        videos = []

        for c in chunks:
            search_request = youtube.videos().list(
                id=",".join(c),
                part="id, snippet, contentDetails",
            )

            while search_request is not None:
                search_response = search_request.execute()
                for v in search_response.get("items", []):
                    videos.append(YoutubeService.parse_youtube_entry(v))

                search_request = youtube.playlistItems().list_next(search_request, search_response)

        return videos

    @staticmethod
    def parse_youtube_entry(entry):
        snippet = entry['snippet']
        item = dict(
            title=snippet.get("title"),
            external_id=entry.get("id"),
            author=snippet.get("channelTitle"),
            description=snippet.get("description"),
            thumbnail=YoutubeService.best_thumbnail(snippet.get("thumbnails"))
        )

        try:
            duration_raw = entry.get("contentDetails").get("duration")
            duration_parsed = isodate.parse_duration(duration_raw)
            item['duration'] = int(duration_parsed.total_seconds())
        except(ValueError, TypeError):
            item['duration'] = 1337

        return item

    @staticmethod
    def best_thumbnail(thumbnail):
        keys = ["maxres", "standard", "high", "medium", "default"]
        for key in keys:
            item = thumbnail.get(key)
            if item:
                return item.get("url")
