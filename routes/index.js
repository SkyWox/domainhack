var express = require('express');
var router = express.Router();
var whois = require('./whois')
//start client-defined timeout at 10 sec
var clientTimeout = 10000

router.use('/users', require('./users'));
router.use('/tld', require('./tld'));
router.get('*', (req, res) => {
  res.sendFile(path.join(__dirname+'/client/build/index.html'));
});
router.use('/whois', whois);

function calcTimeout(freshTime, oldTime){
  //newTime = median(oldTime * 5, freshTime)
  return newTime
}
/*
router.get('/whois', (req, res) => {
  req.locals.timeout = newTimeout
  //get request here
  clientTimeout = calcTimeout(res.locals.resTime, clientTimeout)
  res.json()
})
*/

module.exports = router;
