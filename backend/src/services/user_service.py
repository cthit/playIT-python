
import requests
from src.cache import cache
from src.services.token_cache_service import TokenCacheService

TOKEN_CHECK_URL = "https://account.chalmers.it/userInfo.php?token=%s"


class UserService(object):

    @staticmethod
    def get_user(token):
        if not token:
            return None

        user = cache.get(token)

        if not user:
            url = TOKEN_CHECK_URL % token
            response = requests.get(url)
            data = response.json()
            if data.get("cid"):
                user = data
                TokenCacheService.set_token(token, user)
                cache.set("token:" + token, user)

        return user

