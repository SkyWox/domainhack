var express = require('express');
var router = express.Router();
const axios = require('axios')
//regex to find non-unicode characters:
reg = /[^\u0000-\u024F\u1E00-\u1EFF\u2C60-\u2C7F\uA720-\uA7FF]/g

router.get('/', function(req, res, next) {
  domain = req.query.domain

  axios({
    method : 'get',
    url : 'https://whois-v0.p.mashape.com/domains',
    headers: {
      'X-Mashape-Key' : 'qxFuJeqk5Gmsh20KuhIstgzfK3LZp1JZSydjsn0gSPaWScdHAB'
    }
  })
  .then(resp => {
    res.json(resp.data)
  })
  .catch(error => {
    res.json(['failure'])
    console.log(error.response);
    }
  )

});

module.exports = router;
