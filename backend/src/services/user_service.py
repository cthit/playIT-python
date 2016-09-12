
import requests
from tornado.options import options
from src.cache import cache
from src.services.token_cache_service import TokenCacheService

def get_lan_user(token):
    return requests.get("http://lan.chalmers.it/?p=userInfo",headers={'Cookie': 'chalmers_lan_auth=%s' % token})


def get_account_user(token):
    url = "https://account.chalmers.it/userInfo.php?token=%s" % token
    return requests.get(url)


class UserService(object):

    @staticmethod
    def get_user_by_id(user_id):
        user = cache.get(user_id)
        if user:
            return user
        else:
            return dict()

    @staticmethod
    def get_user_by_token(token):
        if not token:
            return None

        user = cache.get(token)

        if not user:
            response = None
            if options.auth_provider == 'account':
                response = get_account_user(token)
            elif options.auth_provider == 'lan':
                response = get_lan_user(token)
            else:
                raise ValueError('Unknown auth_provider')

            data = response.json()
            if data.get("cid"):
                user = data
                TokenCacheService.set_token(token, user)
                cache.set(user.get("cid"), user)

        return user

