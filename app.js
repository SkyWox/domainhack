var express = require('express')
const path = require('path')
var favicon = require('serve-favicon')
var logger = require('morgan')
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
if (process.env.NODE_ENV !== 'production') {
	require('dotenv').load()
}

var app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
//serve static files from React app
app.use(express.static(path.join(__dirname, 'client/build')))

app.use(require('./routes'))

const port = process.env.PORT || 5000
app.listen(port)

console.log(`Express server listening on ${port}`)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	var err = new Error('Not Found')
	err.status = 404
	next(err)
})

// error handler
app.use(function(err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message
	res.locals.error = req.app.get('env') === 'development' ? err : {}
	console.log(err)
	// render the error page
	res.status(err.status || 500)
	res.render('error')
})

module.exports = app
