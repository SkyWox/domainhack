var express = require('express')
var router = express.Router()
//var whois = require('./whois')

//start client-defined timeout at 10 sec
var clientTimeout = 10001

router.use('/users', require('./users'))
router.use('/tld', require('./tld'))

router.use('/whois', (req, res, next) => {
	req.setTimeout(clientTimeout)
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
