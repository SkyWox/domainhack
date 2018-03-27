# Domain Hack

[![Travis](https://travis-ci.org/SkyWox/domainhack.svg?branch=master)](https://travis-ci.org/SkyWox/domainhack)

<!-- TOC -->

* [Domain Hack](#domain-hack)
* [What is it?](#what-is-it)
* [Features](#features)
* [Running Your Own Copy](#running-your-own-copy)
  * [Setup](#setup)
  * [Run](#run)
  * [Built with](#built-with)
  * [License](#license)

<!-- /TOC -->

# What is it?

A site that uses the [WhoIs API]() to help you brainstorm clever domain names.

For example if you want to find domain names for your business, Fiesta Taco, just type it in and see that:

* FiestaTaco.com is taken
* FiestaTaco.net is available
* FiestaTaco.org is available
* FiestaTaco.io is taken
* [Fiestat.aco](http://fiestat.aco) is available
* Fiestata.co is taken

# Features

* Throttling and sets dynamic timeouts on API requests to optimize performance of the rather slow WhoIs API
* CSRF cookies secures all API requests to prevent abuse
* Redis database caching for fast retrieval of recent searches
* Picks referral partners and generates links in real-time to maximize referral bounty

# Running Your Own Copy

## Setup

This README assumes you're hosting on Heroku.

Make sure you have keys for the following accounts and update them in `.envs` file. Rename the file to `.env` before deploying

1.  [WhoIs API](https://market.mashape.com/malkusch/whois). You can use other APIs as well which should require only minor changes to the /tld/ route.
2.  [Heroku Redis database](https://www.heroku.com/redis)
3.  [ShareASale Affiliate Account](https://account.shareasale.com/newsignup.cfm) - sign up and create an affiliate account with the domain registrar of your choice. Update this in `/routes/referral.js`
4.  Default timeout is set to 12 seconds (12000 ms). See the timeout section for more discussion on how this is used.

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
