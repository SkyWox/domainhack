var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var lottoGen = require('./lottoGen.js');
const lottoList = require("./lottoList.json")
//var freshCheck = require('./freshCheck.js');
var index = require('./routes/index');
var users = require('./routes/users');

var lottoSpecs = function (name) {
  var specs = {}
    for (var i in lottoList){
      if (lottoList[i].name == name){
        specs = lottoList[i]
      }
    }
    return specs
}

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
//serve static files from React app
app.use(express.static(path.join(__dirname, 'client/build')));

app.use('/', index);
app.use('/users', users);

app.get('/api/lottoList'), (req, res) => {
  var nameRes = []
  switch (req.query.name) {
    case 'name':
        for (var i in lottoList){
          nameRes[i] = lottoList.name[i]
        }
      break;
      case 'proper':
        console.log('in proper')
        for (var i in lottoList){
          nameRes[i] = lottoList.proper[i]
        }
      break;
  }
  console.log(nameRes[0])
  res.json(nameRes)

}

app.get('/api/specs', (req, res) => {
  res.json(lottoSpecs(req.query.name))
})

app.get('/api/getnumbers', (req, res) => {
    //successfully getting fresh number
    success = false;
    const mint = req.query.mint;
    const name = req.query.name;
    const date = req.query.date;

    const specs = lottoSpecs(name)

    //keep getting new numbers until mint is happy
    while (success == false){
      numbers = lottoGen(specs)
      //success = freshCheck(numbers, mint)
      success = true;
    }

    res.json(numbers);
})

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

const port = process.env.PORT || 5000;
app.listen(port);

console.log(`Number generator listening on ${port}`);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
