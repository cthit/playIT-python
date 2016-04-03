#!/usr/bin/env python3

import logging
import os
import tornado.httpserver
from tornado.options import options, define

define('server', default=os.environ.get('SERVER', False), help='Launching tornado webserver.')
define('port', default=os.environ.get('PORT', 80), help='Webserver listening port.')
define('cors_host', default=os.environ.get('CORS_HOST', 'http://localhost/'), help='Setting cors for host')
define('redis_host', default=os.environ.get('REDIS_HOST', 'localhost'), help='Redis server url')
define('static_path', default=os.environ.get('STATIC_PATH', 'static/'), help='Setup static url path.')
define('debug', default=os.environ.get('DEBUG', False), help='Enables debug output.')

define('soundcloud_key', default=os.environ.get('SOUNDCLOUD_ID', None), help='Soundcloud api key.')
define('youtube_key', default=os.environ.get('YOUTUBE_KEY', None), help='youtube api key')
define('spotify_key', default=os.environ.get('SPOTIFY_KEY', None), help='spotify app api key')
define('spotify_id', default=os.environ.get('SPOTIFY_CLIENT_ID', None), help='spotify app id')
define('spotify_client_secret', default=os.environ.get('SPOTIFY_CLIENT_SECRET', None), help='spotify app client secret')
define('spotify_redirect_uri', default=os.environ.get('SPOTIFY_REDIRECT_URI', None), help='spotidy app redirect uri')


define('database_backend', default=os.environ.get('DATABASE_BACKEND'), help="Choose database backend, MySQL and SQLite supported", group="database")
define('database', default=os.environ.get('DATABASE'), help="Database", group="database")
define('database_host', default=os.environ.get('DATABASE_HOST', 'localhost'), help="Database host", group="database")
define('database_user', default=os.environ.get('DATABASE_USER', 'root'), help="Database username", group="database")
define('database_pass', default=os.environ.get('DATABASE_PASS'), help="Database password", group="database")
define('create_tables', default=os.environ.get('CREATE_TABLES', False), help="Create tables")

settings = {
    'static_path': options.static_path,
    'debug': options.debug,
    'login_url': '/error',
}

options.parse_command_line()

level = logging.DEBUG if options.debug else logging.INFO
logging.basicConfig(level=level,
                    format='%(asctime)s %(levelname)-8s %(message)s',
                    datefmt='%a, %d %b %Y %H:%M:%S')

from src.database import setup_database
(success, msg) = setup_database(options.group_dict("database"))

if not success:
    logging.error(msg)
    exit(1)

logging.info("Importing handlers...")
from src.handlers import handlers

logging.info("Creating web application...")
application = tornado.web.Application(handlers, '', **settings)

if options.server:
    http_server = tornado.httpserver.HTTPServer(application)
    http_server.listen(options.port)
    # tornado.autoreload.start()
    logging.info("Starting server and listening for messages on port: %s" % options.port)
    tornado.ioloop.IOLoop.instance().start()
