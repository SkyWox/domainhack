var express = require('express')
var router = express.Router()
const axios = require('axios')

router.get('/', function(req, res, next) {
  dom = req.query.domain
  var maxAttempts = 4
  var attempts = 0
  callWhois(dom)
  //uncomment below for "offline" testing
  res.json({ available: true })

  function callWhois(domain) {
    while (attempts <= maxAttempts) {
      attempts++
      axios({
        method: 'get',
        url: 'https://whois-v0.p.mashape.com/check?domain=' + domain,
        timeout: req.socket._idleTimeout,
        headers: {
          'X-Mashape-Key': process.env.WHOIS_MASHAPE_KEY
        }
      })
        .then(resp => {
          console.log(domain + ' is ' + resp.data.available)
          res.send(resp.data)
          console.log(res.status)
        })
        .catch(error => {
          console.log('error area')
          console.log(error)
          if (error.code === 'ECONNABORTED') {
            console.log(
              'request-defined timeout on ' +
                domain +
                ' restarting for attempt #' +
                (attempts + 1)
            )
            //process.nextTick(() => callWhois(domain))
            res.send({ available: 'bad' }).status(444)
          } else if (error.response.status === 404) {
            console.log('invalid domain ' + domain)
            res.send({ available: 'bad' }).status(404)
          } else if (error.response.status === 504) {
            console.log('timeout on ' + domain + ' restarting')
            //try again. don't send back a res so that the client waits
            //process.nextTick(() => callWhois(domain))
            res.send({ available: 'bad' }).status(504)
          } else {
            console.log(error)
            res.send({ available: 'bad' })
          }
        })
    }
  }
})

module.exports = router
