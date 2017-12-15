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
      res.send(Array.from(result))
    } else {
      axios({
        method: 'get',
        url: 'https://whois-v0.p.mashape.com/domains',
        headers: {
          'X-Mashape-Key': 'qxFuJeqk5Gmsh20KuhIstgzfK3LZp1JZSydjsn0gSPaWScdHAB'
        }
      })
        .then(resp => {
          const listed = Array.asList(resp.data)
          console.log(resp.data)
          Arrays.stream(resp.data)
            .boxed()
            .collect(Collectors.toList())
          //console.log(resp.data)
          //console.log(listed)
          client.setex('0TLD', 43200, resp.data)

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
