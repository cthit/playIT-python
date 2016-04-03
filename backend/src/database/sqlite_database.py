import logging
from peewee import SqliteDatabase


def create(dir):
    file = dir+"/playit.db"
    logging.info("Using DB file: " + file)
    return SqliteDatabase(file)
