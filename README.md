# Domain Hack

[![Travis](https://travis-ci.org/SkyWox/domainhack.svg?branch=master)](https://travis-ci.org/SkyWox/domainhack)

# Features

# Running a Copy

## Setup

This README assumes you're hosting on Heroku.

Make sure you have keys for the following accounts and update them in `.envs` file. Rename the file to `.env`

1. [WhoIs API](https://market.mashape.com/malkusch/whois). You can use other APIs as well which should require only minor changes to the /tld/ route.
2. [Heroku Redis database](https://www.heroku.com/redis)
3. Default timeout is set to 12 seconds (12000 ms). See the timeout section for more discussion on how this is used.

## Run

Heroku can run this out of the box as long as you have the .env variables mirrored to the Heroku config and a redis database provisioned.

To run the site locally for development, run this in the top level directory:

```
npm run start:dev
```

This will start a nodemon that will restart the server when it detects changes to the source.

To run the client, open another terminal and cd to the `/client/` directory and run:

```
npm run start
```

This will use react-script's daemon to restart on source changes.

## Built with

* NodeJS
* React
* Express
* Redis
* [WhoIs API](https://market.mashape.com/malkusch/whois)

## License

MIT © [Skylar Wilcox](http://skywox.me)
