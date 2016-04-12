import logging

from src.constants import *
from src.models.vote import PlaylistVote, Vote
from src.services.clients_service import ClientsService
from src.services.item_service import ItemService


class VotingService(object):

    @staticmethod
    def add_vote(cid, item, data, new=False):
        if item:
            logging.info("%r" % data)
            VotingService._create_vote(cid, item, data)
            item.check_value()

            return True, "", item, new
        else:
            return False, "Could not find item with id: %s" % (data.get("id", "NO_ID_SUPPLIED")), None, None

    @staticmethod
    def _create_vote(cid, item, data):
        vote_value = data.get("vote", 1)
        if "list" in item.type:
            vote = PlaylistVote.create_vote(cid=cid, value=vote_value, item=item)
        else:
            vote = Vote.create_vote(cid=cid, value=vote_value, item=item)

        vote.save()

        return vote

    @staticmethod
    def remove_vote(cid, item):
        if "list" in item.type:
            vote = VotingService.find_list_vote(cid, item)
        else:
            vote = VotingService.find_item_vote(cid, item)

        if vote:
            vote.delete_instance()
            return True
        else:
            return False

    @staticmethod
    def find_item_vote(cid, item):
        return Vote.fetch().where(
            (Vote.cid == cid) &
            (Vote.item == item)
        ).first()

    @staticmethod
    def find_list_vote(cid, item):
        return PlaylistVote.fetch().where(
            (PlaylistVote.cid == cid) &
            (PlaylistVote.item == item)
        ).first()
