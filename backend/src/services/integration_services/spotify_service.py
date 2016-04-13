#!/usr/bin/python

import spotipy

from src.utils import DictNoNone


class SpotifyService:
    @staticmethod
    def get_playlist(token, username, playlist_id):
        sp = spotipy.Spotify(auth=token)

        playlist = sp.user_playlist(username, playlist_id=playlist_id)

        playlist_tracks = sp.user_playlist_tracks(username, playlist_id=playlist_id)
        tracks = list()
        for item in playlist_tracks.get("items"):
            tracks.append(SpotifyService.create_spotify_item(item.get("track")))

        return DictNoNone(
            title=playlist.get("name"),
            author=playlist.get("owner").get("id"),
            thumbnail=playlist.get("images")[0].get("url"),
            item_count=playlist.get("tracks").get("total"),
            tracks=tracks
        )

    @staticmethod
    def get_playlist_tracks(playlist_id):
        pass

    @staticmethod
    def get_track(track_id):
        sp = spotipy.Spotify()
        track = sp.track(track_id)

        if track:
            return SpotifyService.create_spotify_item(track)
        return dict()

    @staticmethod
    def create_spotify_item(track):
        return dict(
            title=track.get('name'),
            external_id=str(track.get('id')),
            author=", ".join((a.get("name") for a in track.get("artists"))),
            thumbnail=track.get('album').get("images")[0].get("url"),
            duration=int(track.get('duration_ms') / 1000 + 0.5)
        )
