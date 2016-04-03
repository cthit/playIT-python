import logging
from tornado.websocket import WebSocketClosedError


class ClientsService(object):
    USER_CLIENTS = list()
    PLAYBACK_CLIENTS = list()

    @staticmethod
    def add_user_client(client):
        logging.info("Added user client")
        ClientsService.USER_CLIENTS.append(client)

    @staticmethod
    def add_playback_client(client):
        logging.info("Added playback client")
        ClientsService.PLAYBACK_CLIENTS.append(client)

    @staticmethod
    def broadcast_to_user_clients(topic, msg):
        ClientsService._broadcast(ClientsService.USER_CLIENTS, topic, msg)

    @staticmethod
    def broadcast_to_playback_clients(topic, msg):
        ClientsService._broadcast(ClientsService.PLAYBACK_CLIENTS, topic, msg)

    @staticmethod
    def broadcast(topic, msg):
        total = list(ClientsService.PLAYBACK_CLIENTS)
        total.extend(ClientsService.USER_CLIENTS)
        ClientsService._broadcast(total, topic, msg)

    @staticmethod
    def _broadcast(clients, topic, msg):
        for client in clients:
            try:
                client.send(topic, msg)
            except WebSocketClosedError:
                try:
                    ClientsService.PLAYBACK_CLIENTS.remove(client)
                    ClientsService.USER_CLIENTS.remove(client)
                except ValueError:
                    pass  # Allow trying to delete clients not in list

    @staticmethod
    def remove_playback_client(client):
        logging.info("Removed playback client")
        ClientsService.PLAYBACK_CLIENTS.remove(client)

    @staticmethod
    def remove_user_client(client):
        logging.info("Removed user client")
        ClientsService.USER_CLIENTS.remove(client)
