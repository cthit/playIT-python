
class AbstractPlaylistItemAdapter(object):
    @staticmethod
    def create_item(item):
        raise NotImplementedError("Should have implemented this")

    @staticmethod
    def cache_list(playlist_id):
        raise NotImplementedError("Should have implemented this")
