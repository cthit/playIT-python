#!/usr/bin/env python3

import logging

import tornado.httpserver
from tornado.options import options, define

define('server', default=True, help='Launching tornado webserver.')
define('port', default=80, help='Webserver listening port.')
define('cors_host', default='http://localhost/', help='Setting cors for host')
define('static_path', default='static/', help='Setup static url path.')
define('debug', default=False, help='Enables debug output.')

define('soundcloud_key', default=None, help='Soundcloud api key.')
define('youtube_key', default=None, help='youtube api key')
define('spotify_key', default=None, help='spotify app api key')
define('spotify_id', default=None, help='spotify app id')
define('spotify_client_secret', default=None, help='spotify app client secret')
define('spotify_redirect_uri', default=None, help='spotify app redirect uri')

define('database_backend', help="Choose database backend, MySQL and SQLite supported", group="database")
define('database', help="Database", group="database")
define('database_host', default='localhost', help="Database host", group="database")
define('database_user', default='root', help="Database username", group="database")
define('database_pass', help="Database password", group="database")
define('database_dir', help="Database directory for sqlite files", group="database")
define('create_tables', default=False, help="Create tables")

options.parse_config_file("options.py")
options.parse_command_line()

settings = {
    'static_path': options.static_path,
    'debug': options.debug,
    'login_url': '/error',
}

level = logging.DEBUG if options.debug else logging.INFO
logging.basicConfig(level=level,
                    format='%(asctime)s %(levelname)-8s %(message)s',
                    datefmt='%a, %d %b %Y %H:%M:%S')

from src.database import setup_database  # noqa
(success, msg) = setup_database(options.group_dict("database"))

if not success:
    logging.error(msg)
    exit(1)

logging.info("Importing handlers...")
from src.handlers import handlers  # noqa

logging.info("Creating web application...")
application = tornado.web.Application(handlers, '', **settings)

if options.server:
    logging.info("Starting server and listening for messages on port: %s" % options.port)
    http_server = tornado.httpserver.HTTPServer(application)
    http_server.listen(options.port)
    # tornado.autoreload.start()
    tornado.ioloop.IOLoop.instance().start()
