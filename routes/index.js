var express = require('express')
const path = require('path')
var router = express.Router()

//start client-defined timeout at 10 sec
var clientTimeout = 2001

router.use('/tld', require('./tld'))
router.use('/referral', require('./referral'))

router.use('/whois', (req, res, next) => {
  //req.setTimeout(clientTimeout) -> this is the client req getting cancelled
  next()
})
/*
Attempt to adjust timing based on delay
https://stackoverflow.com/questions/11337402/is-it-ok-to-add-data-to-the-response-object-in-a-middleware-module-in-express-js

function calcTimeout(freshTime, oldTime){
  //newTime = median(oldTime * 5, freshTime)
  return newTime
}

router.use('/whois', (req, res) => {
  const domain = req.query.domain

  //req.locals.time = clientTimeout

  req.app.get('/', whois)
  .then(resp => resp.json())
  .then(resp => {console.log(resp)})
  .catch()

  res.json({available : false})
})
*/
router.use('/whois', require('./whois'))

router.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/client/build/index.html'))
})
module.exports = router
