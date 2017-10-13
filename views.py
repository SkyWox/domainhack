from aiohttp import web
import aiohttp

async def index(request):
    return web.FileResponse('./client/build/index.html')

async def whois(request):
    name = 'cornstuff.com'
    headers={
    "X-Mashape-Key": "UMkS3cLJWrmshYSH17c1BpxsYwmdp1A2NS9jsnuHzwt3NriKtj",
    "Accept": "application/json"
    }
    async with aiohttp.ClientSession() as session:
        async with session.get(str('https://whois-v0.p.mashape.com/check?domain='+name),
        headers = headers) as resp:
            resp2 = await resp.json()
            avail = resp2['available']
            print (avail)

            if avail:
                greeting = 'Yay! ' + name + ' is available!'
            else:
                greeting = 'Sorry, someone else owns ' + name + ' :-('

    return web.Response(text=greeting)
