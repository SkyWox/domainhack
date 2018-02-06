var express = require('express')
const path = require('path')
var router = express.Router()

//start client-defined timeout at 10 sec
var clientTimeout = 2001

router.use('/tld', require('./tld'))
router.use('/referral', require('./referral'))

router.use('/whois', require('./whois'))

router.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/client/build/index.html'))
})
module.exports = router
