#!/usr/bin/python3
import soundcloud as sc
import argparse
from tornado.options import options
from src.utils import DictNoNone

SOUNDCLOUD_KEY = options.soundcloud_key

soundcloud = sc.Client(client_id=SOUNDCLOUD_KEY)


class SoundcloudService:
    @staticmethod
    def get_playlist(playlist_id):
        playlist = soundcloud.get('playlists/%s' % playlist_id)
        tracks = list()
        for track in playlist.tracks:
            tracks.append(SoundcloudService.create_soundcloud_item(track))

        return DictNoNone(
            title=playlist.title,
            author=playlist.user.get("username"),
            thumbnail=playlist.artwork_url,
            item_count=len(tracks),
            tracks=tracks
        )

    @staticmethod
    def get_playlist_tracks(playlist_id):
        playlist = soundcloud.get('playlists/%s' % playlist_id)
        tracks = list()
        for track in playlist.tracks:
            tracks.append(SoundcloudService.create_soundcloud_item(track))

        return tracks

    @staticmethod
    def create_soundcloud_item(track):
        return dict(
            title=track.get('title'),
            external_id=str(track.get('id')),
            author=track.get('user', dict()).get('username'),
            thumbnail=track.get('artwork_url'),
            duration=int(track.get('duration')/1000 + 0.5)
        )
