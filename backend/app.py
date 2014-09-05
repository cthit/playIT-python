#!/usr/bin/env python3

import logging
import os
import sys
sys.path.insert(0, 'libs')

import tornado.web
import tornado.httpserver
import tornado.autoreload
import tornado.websocket
from tornado.options import options, define

define("app_identifier", default=os.environ.get("APP_IDENTIFIER", ""), help="Unique identifier for app")

define('server', default=os.environ.get('SERVER', False), help='Launching tornado webserver.')
define('port', default=os.environ.get('PORT', 80), help='Webserver listening port.')
define('cors_host', default=os.environ.get('CORS_HOST', 'http://localhost/'), help='Setting cors for host')
define('redis_host', default=os.environ.get('REDIS_HOST', 'localhost'), help='Redis server url')
define('static_path', default=os.environ.get('STATIC_PATH', 'static/'), help='Setup static url path.')
define('debug', default=os.environ.get('DEBUG', False), help='Enables debug output.')

define('database', default=os.environ.get('DATABASE'), help="Database")
define('database_host', default=os.environ.get('DATABASE_HOST', 'localhost'), help="Database host")
define('database_user', default=os.environ.get('DATABASE_USER', 'root'), help="Database username")
define('database_pass', default=os.environ.get('DATABASE_PASS'), help="Database password")
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

from src.handlers import handlers
from src.utils.memcache import RedisMemcache

application = tornado.web.Application(handlers, '', **settings)

if options.server:
    http_server = tornado.httpserver.HTTPServer(application)
    http_server.listen(options.port)
    #tornado.autoreload.start()
    tornado.ioloop.IOLoop.instance().start()
