from dogpile.cache import make_region, register_backend

register_backend("dictionary", "src.cache.dictionary_backend", "DictionaryBackend")
cache = make_region("playit_cache")
cache.configure("dictionary")


