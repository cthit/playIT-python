import logging
from . import mysql_database as mysql
from . import sqlite_database as sqlite

database = None


def _extract_backend_string(database_options):
    backend = database_options.get("database_backend", "")
    if not backend:
        backend = ""

    return backend.lower()


def check_database_options(database_options_dict):
    backend = _extract_backend_string(database_options_dict)

    if "mysql" in backend.lower():
        mysql_options = [database_options_dict.get('database'),
                         database_options_dict.get('database_host'),
                         database_options_dict.get('database_user')]

        password = database_options_dict.get('database_pass')
        if password == "":
            logging.warning("Using empty database password")
        else:
            mysql_options.append(password)

        if all(mysql_options):
            return True, ""
        else:
            return False, 'Missing required options for mysql database, all of these are required: "database", "database_host", "database_user", "database_pass"'  # noqa
    else:
        return True, ""


def create_database(database_options):
    backend = _extract_backend_string(database_options)

    if "mysql" in backend:
        logging.info("Using MySQL-backend")
        return mysql.create(database_options)
    elif "sqlite" in backend:
        logging.info("Using Sqlite-backend")
        return sqlite.create(database_options.get("database_dir", "."))
    else:
        logging.info("No specific database backend stated, using default sqlite")
        return sqlite.create(".")


def setup_database(database_options):
    (success, msg) = check_database_options(database_options)

    if not success:
        return False, msg
    else:
        # noinspection PyShadowingNames,PyUnusedLocal
        database = create_database(database_options)
        return True, ""
