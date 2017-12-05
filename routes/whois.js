var express = require('express')
var router = express.Router()
const axios = require('axios')

router.get('/', function(req, res, next) {
	dom = req.query.domain
	callWhois(dom)
	//uncomment below for "offline" testing
	//res.json({available : true})

	function callWhois(domain) {
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
				res.json(resp.data)
			})
			.catch(error => {
				if (error.code === 'ECONNABORTED') {
					console.log('request-defined timeout on ' + domain + ' restarting')
					process.nextTick(() => callWhois(domain))
				} else if (error.response.status === 404) {
					console.log('invalid domain ' + domain)
					res.json({ available: 'bad' })
				} else if (error.response.status === 504) {
					console.log('timeout on ' + domain + ' restarting')
					//try again. don't send back a res so that the client waits
					process.nextTick(() => callWhois(domain))
				} else {
					console.log(error)
					res.json({ available: 'unknown' })
				}
			})
	}
})

module.exports = router
