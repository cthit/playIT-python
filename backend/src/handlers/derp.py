from tornado import websocket
from src.models.media_item import MediaItem

class DerpHandler(websocket.WebSocketHandler):

    def check_origin(self, origin):
        return True

    def open(self):
        print("New connection ya")
        self.write_message("Hello World!")

    def on_message(self, message):
        print("Message received: %s" % message)
        self.write_message("You're messageing me")

    def on_close(self):
        print("Connection closed MOTHERFUCKER")

handlers = [
    (r'/derp', DerpHandler)
]