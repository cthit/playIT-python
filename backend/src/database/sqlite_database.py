from peewee import SqliteDatabase


def create():
    return SqliteDatabase("playit.db")
