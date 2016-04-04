from src.cache import cache


class TokenCacheService(object):

    TOKEN_PREFIX = "token:"

    @staticmethod
    def get_token(token):
        return cache.get(TokenCacheService.TOKEN_PREFIX + token)

    @staticmethod
    def set_token(token, user):
        return cache.set(TokenCacheService.TOKEN_PREFIX + token, user)

    @staticmethod
    def delete_token(token):
        if not token:
            return
        return cache.delete(TokenCacheService.TOKEN_PREFIX + token)
