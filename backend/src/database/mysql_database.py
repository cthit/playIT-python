from peewee import MySQLDatabase


def create(options):
    return MySQLDatabase(
        options.get("database"),
        host=options.get("database_host"),
        user=options.get("database_user"),
        passwd=options.get("database_pass")
    )
