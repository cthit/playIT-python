from tornado.options import options
from peewee import MySQLDatabase

database = MySQLDatabase(options.database,
                         host=options.database_host,
                         user=options.database_user,
                         passwd=options.database_pass)
