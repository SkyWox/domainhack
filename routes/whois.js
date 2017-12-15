var express = require('express')
var router = express.Router()
const axios = require('axios')
var axiosRetry = require('axios-retry')

router.get('/', function(req, res, next) {
  dom = req.query.domain

  callWhois(dom)
  //uncomment below for "offline" testing
  //res.json({ available: true })

  function callWhois(domain) {
    axios({
      method: 'get',
      url: 'https://whois-v0.p.mashape.com/check?domain=' + domain,
      timeout: req.socket._idleTimeout,
      headers: {
        'X-Mashape-Key': process.env.WHOIS_MASHAPE_KEY
      },
      'axios-retry': { retries: 0 }
    })
      .then(resp => {
        console.log(domain + ' is ' + resp.data.available)
        res.send(resp.data)
      })
      .catch(error => {
        console.log('error area')
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
  }
})

module.exports = router
