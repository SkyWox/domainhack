from views import index, whois
import os
project_root = os.getcwd()

def setup_routes(app):
    app.router.add_get('/', index)
    app.router.add_get('/whois', whois)
    #have to figure out what the heck they mean with this
    #http://aiohttp.readthedocs.io/en/stable/tutorial.html#aiohttp-tutorial
    # > static files
    app.router.add_static('/static/',
                            path=str(os.getcwd() +'\client\\build\static'),
                            name='static')
