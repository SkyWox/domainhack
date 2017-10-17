var express = require('express');
var router = express.Router();
const axios = require('axios')

router.get('/', function(req, res, next) {
  domain = req.query.domain

  axios({
    method : 'get',
    url : 'https://whois-v0.p.mashape.com/check?domain=' + domain,
    headers: {
      'X-Mashape-Key' : 'qxFuJeqk5Gmsh20KuhIstgzfK3LZp1JZSydjsn0gSPaWScdHAB'
    }
  })
  .then(resp => {
    console.log(domain + ' is ' + resp.data.available)
    res.json(resp.data)
  })
  .catch(error => {
    if (error.response.status === 404)
    {
      console.log('invalid domain ' + domain)
      res.json({available : 'bad'})
    }else if (error.response.status === 504){
      console.log('timeout on ' + domain)
      res.json({available : 'unknown'})
    }else{
    console.log(error.response.status);
    }
  })

});

module.exports = router;
