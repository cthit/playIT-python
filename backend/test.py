from src.cache import *

data = cache.set("somekey", "somevalue")

print(data)

print("retrieving")
print(cache.get("somekey"))
