from tornado.options import options, define
from peewee import *

database = MySQLDatabase(options.database,
                         host=options.database_host,
                         user=options.database_user,
                         passwd=options.database_pass)