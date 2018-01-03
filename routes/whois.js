var express = require('express')
var router = express.Router()
const axios = require('axios')
var axiosRetry = require('axios-retry')
var redis = require('redis')
var bluebird = require('bluebird')
bluebird.promisifyAll(redis.RedisClient.prototype)

var client = redis.createClient(process.env.REDIS_URL)
const timeout = process.env.INITIAL_TIMEOUT
const maxAttempts = 2
//exponential backoff function

router.get('/stats', function(req, res, next) {
  client.get('00Successes', function(error, successes) {
    client.hgetall('00Fails', function(error, fails) {
      if (fails)
        res.send({ successes: parseInt(successes), fails: parseInt(fails.num) })
      else res.send({ successes: 0, fails: 0 })
    })
  })
})

router.get('/', function(req, res, next) {
  client.get(req.query.domain, function(error, result) {
    if (result) {
      res.send({
        available: result === 'true',
        source: 'redis cache'
      })
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
    //'axios-retry': { retries: 2, retryCondition: 'isIdempotentRequestError' },
    headers: {
      'X-Mashape-Key': process.env.WHOIS_MASHAPE_KEY
    }
  })
    .then(resp => {
      console.log(req.query.domain + ' is ' + resp.data.available)
      client.setex(req.query.domain, 300, resp.data.available)
      client.incr('00Successes')
      client.expire('00Sucesses', 3600)
      res.send({ available: resp.data.available })
    })
    .catch(error => {
      if (error.code === 'ECONNABORTED') {
        res.send({ available: 'may be available' }).status(503)
        var numFails = 0
        client.hgetallAsync('00Fails').then(result => {
          if (result) numFails = parseInt(result.num)
          const newavg = 0
          client.hmset('00Fails', 'num', numFails + 1, 'avg', newavg)
          client.expire('00Fails', 3600)
        })
      } else if (error.response.status === 404) {
        console.log('invalid domain ' + req.query.domain)
        res.send({ available: 'bad' }).status(404)
      } else if (error.response.status === 504) {
        console.log('3rd party timeout on ' + req.query.domain)
        res.send({ available: 'may be available' }).status(504)
      } else if (error.response.status === 502) {
        console.log('bad gateway on ' + req.query.domain)
        res.send({ available: 'may be available' }).status(502)
      } else {
        console.log(error)
        res.send({ available: 'bad' })
      }
    })
})

module.exports = router
