import logging
from dogpile.cache.api import CacheBackend, NO_VALUE



class DictionaryBackend(CacheBackend):
    def __init__(self, arguments):
        self.cache = {}

    def get(self, key):
        return self.cache.get(key, NO_VALUE)

    def set(self, key, value):
        self.cache[key] = value

    def delete(self, key):
        try:
            self.cache.pop(key)
        except KeyError:
            logging.info("Could not delete key: %r" % key)
