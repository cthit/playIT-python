import json
import redis
import logging
from tornado.options import options

redis_memcache = redis.StrictRedis(host=options.redis_host, port=6379, db=1, decode_responses=True)
prefix = options.app_identifier


class RedisMemcache(object):

    _pubsub = None

    @staticmethod
    def set(key, value, serializer=None):
        if not key or not value:
            logging.warn("Missing key or value")
            return None

        dump = json.dumps(value, default=serializer)
        return redis_memcache.set(prefix + ":" + key, dump)

    @staticmethod
    def get(key, default=None):
        if not key:
            logging.warn("Missing key, returning default value")
            return default

        try:
            data = redis_memcache.get(prefix + ":" + key)
            if not data:
                return default

            return json.loads(data)
        except (ValueError, TypeError) as _:
            # Invalid json or data is None
            logging.warning("Invalid JSON")
            pass

        return default

    @staticmethod
    def delete(key):
        return redis_memcache.delete(prefix + ":" + key)

    @staticmethod
    def subscribe(channel):
        RedisMemcache._pubsub = RedisMemcache._pubsub or redis_memcache.pubsub()

        channel = prefix + ":" + channel
        return RedisMemcache._pubsub.subscribe(channel)

    @staticmethod
    def unsubscribe(channel):
        RedisMemcache._pubsub = RedisMemcache._pubsub or redis_memcache.pubsub()

        channel = prefix + ":" + channel
        return RedisMemcache._pubsub.unsubscribe(channel)

    @staticmethod
    def listen():
        RedisMemcache._pubsub = RedisMemcache._pubsub or redis_memcache.pubsub()
        for response in RedisMemcache._pubsub.listen():
            if response["type"] == "message":
                try:
                    response["data"] = json.loads(response.get("data", "{}"))
                except (ValueError, TypeError) as e:
                    logging.error("Invalid json: %r" % e)

            yield response

    @staticmethod
    def publish(key, value):
        if key and value:
            redis_memcache.publish(prefix + ":" + key, json.dumps(value))
        else:
            logging.warn("Missing key or value")
