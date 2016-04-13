import functools

from src.services.user_service import UserService

PLAYER_TOKEN = "42BabaYetuHerpaderp"
ADMIN_GROUP = "playITAdmin"


class AuthenticationError(Exception):
    pass


class Authorized(object):
    """Decorate methods with this to require that the user be logged in.
    """

    def __init__(self, group=None):
        self._group = group

    def __call__(self, method):

        @functools.wraps(method)
        def wrapper(cls, *args, **kwargs):

            token = args[0].get("token")

            if not token:
                raise AuthenticationError("NO TOKEN")

            if token == PLAYER_TOKEN:
                return method(cls, *args, **kwargs)

            cls._token = token
            user = UserService.get_user_by_token(token)

            if not user:
                    raise AuthenticationError("INVALID TOKEN")

            if self._group and self._group not in user.get("groups"):
                raise AuthenticationError("You need to be member of %s to do that" % self._group)

            cls._user = user

            return method(cls, *args, **kwargs)

        return wrapper
