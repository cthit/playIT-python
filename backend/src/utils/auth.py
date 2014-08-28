import requests

QUERY_URL = "https://chalmers.it/auth/userInfo.php?cid=%s"


class Auth(object):

    @staticmethod
    def get_user(cid):

        if not isinstance(cid, str):
            return dict()

        response = requests.get(QUERY_URL % cid)

        return response.json()
