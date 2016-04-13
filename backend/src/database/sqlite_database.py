import logging
from peewee import SqliteDatabase


def create(directory):
    file = directory + "/playit.db"
    logging.info("Using DB file: " + file)
    return SqliteDatabase(file)
