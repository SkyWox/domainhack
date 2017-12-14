var express = require('express')
var router = express.Router()

router.get('/', function(req, res) {
  URL =
    'http://shareasale.com/r.cfm?b=467188&u=1627081&m=46483&urllink=www%2Enamecheap%2Ecom%2Fdomains%2Fregistration%2Fresults%2Easpx%3Fdomain%3D' +
    req.query.domain.replace(/\./g, '%2E')

  res.send(URL)
})

module.exports = router
