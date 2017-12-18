var express = require('express')
var router = express.Router()
const axios = require('axios')
//regex to find non-unicode characters:
reg = /[^\u0000-\u024F\u1E00-\u1EFF\u2C60-\u2C7F\uA720-\uA7FF]/g

var client = require('redis').createClient(process.env.REDIS_URL)

router.get('/', function(req, res, next) {
  //intercept and run against redis cache
  client.get('0TLD', function(err, result) {
    if (result) {
      res.send(result.split(','))
    } else {
      axios({
        method: 'get',
        url: 'https://whois-v0.p.mashape.com/domains',
        headers: {
          'X-Mashape-Key': 'qxFuJeqk5Gmsh20KuhIstgzfK3LZp1JZSydjsn0gSPaWScdHAB'
        }
      })
        .then(resp => {
          client.setex('0TLD', 43200, resp.data.toString())
          res.json(resp.data)
        })
        .catch(error => {
          res.json(['failure'])
          console.log(error.response)
        })
    }
  })
})

module.exports = router
