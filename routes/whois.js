var express = require('express')
var router = express.Router()
const axios = require('axios')
var axiosRetry = require('axios-retry')
var responseTime = require('response-time')

var client = require('redis').createClient(process.env.REDIS_URL)
//router.use(responseTime())

router.get('/', function(req, res, next) {
  dom = req.query.domain
  timeout = process.env.INITIAL_TIMEOUT

  //intercept and run against redis cache
  client.get(dom, function(err, result) {
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
  res.json({ available: true })
  domain = req.query.domain
  axios({
    method: 'get',
    url: 'https://whois-v0.p.mashape.com/check?domain=' + domain,
    timeout: timeout,
    'axios-retry': { retries: 0 },
    headers: {
      'X-Mashape-Key': process.env.WHOIS_MASHAPE_KEY
    }
  })
    .then(resp => {
      console.log(domain + ' is ' + resp.data.available)
      client.setex(dom, 300, resp.data.available)
      res.send({ available: resp.data.available })
    })
    .catch(error => {
      if (error.code === 'ECONNABORTED') {
        console.log('request-defined timeout on ' + domain)
        res.send({ available: 'may be available' }).status(444)
      } else if (error.response.status === 404) {
        console.log('invalid domain ' + domain)
        res.send({ available: 'bad' }).status(404)
      } else if (error.response.status === 504) {
        console.log('3rd party timeout on ' + domain)
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
