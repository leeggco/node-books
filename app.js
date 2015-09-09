var express = require('express');
var path = require('path');
var ejs = require('ejs');
var favicon = require('serve-favicon');
var logger = require('morgan');
var mongoose = require('mongoose')
var connect = require('connect');
var session = require('express-session');
var mongoStore = require('connect-mongo')(session);  //此处传入express无效
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var routes = require('./routes/index');
var User = require('./models/user');
var dbUrl = 'mongodb://localhost/books';
var request = require('request');
var fs = require('fs');
var app = express();

mongoose.connect(dbUrl, function(err){
  if(err){
    console.log('MongoDB连接失败!');
  }else{
    console.log('MongoDB连接成功!');
  }
});

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'books',
  store: new mongoStore({
    url: dbUrl,
    collection: 'sessions'
  })
}));

app.set('views', path.join(__dirname, 'views'));
app.engine('html', ejs.__express);
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));

var later = require('later');
later.date.localTime();

var sched = later.parse.recur().every(24).hour(),
t = later.setInterval(function() {
	//图片采集定时任务
	var superagent = require('superagent');
	var cheerio = require('cheerio');
	var Pics = require('./models/pics');
	var getUrl = 'https://unsplash.com/';
	superagent.get(getUrl)
    .end(function (err, sres) {
      if (err) {
        return err;
      }
			//request('http://abc.com/abc.png').pipe(fs.createWriteStream('abc.png'));
      var $ = cheerio.load(sres.text);
      var picSrc = $('.img-responsive').attr('src');
			var fullSrc = getUrl + picSrc;

			var _Pic = new Pics({
				small: picSrc,
				from: getUrl
			});
			
			Pics.find({'small': picSrc}, function(err, data){
				if(err){
					console.log(err)
				}
				if(data.length == 0){
					_Pic.save(function(err, data){ 
						if(err) console.log(err);
						console.log('data:'+data);
					});
				}
			}) 
			
     });
}, sched);

// pre handle user
app.use(function(req, res, next) {
  var _user = req.session.user;
  app.locals.user = _user;
  User.getAvatar(_user, function(err, data){
    if(data){
      app.locals.gravatar = data.gravatar
    }
  });

  next()
});

app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
