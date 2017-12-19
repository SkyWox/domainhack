var express = require('express')
var router = express.Router()
const axios = require('axios')
var axiosRetry = require('axios-retry')
var redis = require('redis')
var bluebird = require('bluebird')
bluebird.promisifyAll(redis.RedisClient.prototype)

var client = redis.createClient(process.env.REDIS_URL)

router.get('/', function(req, res, next) {
  timeout = process.env.INITIAL_TIMEOUT

  client.get(req.query.domain, function(error, result) {
    if (result) {
      res.send({
        available: result === 'true',
        source: 'redis cache'
      })
      req.connection.destroy()
    } else {
      next()
    }
  })
})

router.get('/', function(req, res, next) {
  //uncomment below for "offline" testing
  //res.json({ available: true })
  axios({
    method: 'get',
    url: 'https://whois-v0.p.mashape.com/check?domain=' + req.query.domain,
    timeout: timeout,
    'axios-retry': { retries: 0 },
    headers: {
      'X-Mashape-Key': process.env.WHOIS_MASHAPE_KEY
    }
  })
    .then(resp => {
      console.log(req.query.domain + ' is ' + resp.data.available)
      client
        .setexAsync(req.query.domain, 300, resp.data.available)
        .then(result => {
          res.send({ available: resp.data.available })
        })
    })
    .catch(error => {
      if (error.code === 'ECONNABORTED') {
        console.log('request-defined timeout on ' + req.query.domain)
        res.send({ available: 'may be available' }).status(444)
      } else if (true) {
        console.log(error)
      } else if (error.response.status === 404) {
        console.log('invalid domain ' + req.query.domain)
        res.send({ available: 'bad' }).status(404)
      } else if (error.response.status === 504) {
        console.log('3rd party timeout on ' + req.query.domain)
        res.send({ available: 'may be available' }).status(504)
      } else if (error.response.status === 502) {
        console.log('bad gateway')
        res.send({ available: 'may be available' }).status(502)
      } else {
        console.log(error)
        res.send({ available: 'bad' })
      }
    })
})

module.exports = router
