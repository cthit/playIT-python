import spotipy.oauth2 as oauth2
from tornado.options import options
from src.utils import DictNoNone

# used to generate a token which is then placed in env.server_example as SPOTIFY_KEY
# https://developer.spotify.com/my-applications
#import spotipy.util as util
#token = util.prompt_for_user_token("tejpbit")
#print("%r" %token)

MEMCACCHE_PREFIX = "SPOTIFY_OAUTH"

class SpotifyOauthService:
    auth_map = dict()

    @staticmethod
    def _new_oauth_instance():
        return oauth2.SpotifyOAuth(options.spotify_id, options.spotify_client_secret, options.spotify_redirect_uri)

    @staticmethod
    def _get_oauth_instance(user_id):
        return SpotifyOauthService.auth_map.get(user_id, SpotifyOauthService._new_oauth_instance())

    @staticmethod
    def get_token(user_id):
        sp_oauth = SpotifyOauthService._get_oauth_instance(user_id)
        token_info = sp_oauth.get_cached_token()

        if token_info:
            return token_info['access_token']
        else:
            return None

    @staticmethod
    def get_authorize_uri():
        return SpotifyOauthService._new_oauth_instance.get_authorize_url()

    @staticmethod
    def authorize(user_id, code):
        sp_oauth = SpotifyOauthService._get_oauth_instance(user_id)
        token_info = sp_oauth.get_access_token(code)
        if token_info:
            token = token_info['access_token']
            return True
        else:
            return False