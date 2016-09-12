from tornado.options import options

def get_config():
    if options.auth_provider == 'account':
        return {
            'auth_url': 'https://account.chalmers.it/',
            'cookie_name': 'chalmersItAuth'
        }
    elif options.auth_provider == 'lan':
        return {
            'auth_url': 'http://lan.chalmers.it/',
            'cookie_name': 'chalmers_lan_auth'
            }
    else:
        raise ValueError('Unknown auth provider')