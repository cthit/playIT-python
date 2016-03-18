
import requests
from src.utils.memcache import RedisMemcache


TOKEN_CHECK_URL = "https://account.chalmers.it/userInfo.php?token=%s"


class UserService(object):

    @staticmethod
    def get_user(token):
        if not token:
            return None

        user = RedisMemcache.get(token)

        if not user:
            url = TOKEN_CHECK_URL % token
            response = requests.get(url)
            data = response.json()
            if data.get("cid"):
                user = data
                RedisMemcache.set("token:" + token, user)

        return user

