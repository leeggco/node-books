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
var app = express();

mongoose.connect(dbUrl, function(err){
  if(err){
    console.log('MongoDB连接失败');
  }else{
    console.log('MongoDB连接成功');
  }
});

/*
var schedule = require('node-schedule');
var rule = new schedule.RecurrenceRule();
rule.minute = 42;
var j = schedule.scheduleJob(rule, function(){
  console.log('The answer to life, the universe, and everything!');

	superagent.get('http://www.socwall.com/');
		.end(function (err, sres) {
			// 常规的错误处理
			if (err) {
				return err;
			}
			// sres.text 里面存储着网页的 html 内容，将它传给 cheerio.load 之后
			// 就可以得到一个实现了 jquery 接口的变量，我们习惯性地将它命名为 `$`
			// 剩下就都是 jquery 的内容了
			var $ = cheerio.load(sres.text);
			var items = [];
			$('#content .wallpaper .image img').each(function (idx, element) {
				var $element = $(element);
				console.log($element)
				items.push({
					src: $element.attr('src')
				});
			});
			console.log(items)
		});
});

var timer = setInterval(function() {
	superagent.get('https://www.500px.com/')
	.end(function (err, sres) {
		// 常规的错误处理
		if (err) {
			return err;
		}
		// sres.text 里面存储着网页的 html 内容，将它传给 cheerio.load 之后
		// 就可以得到一个实现了 jquery 接口的变量，我们习惯性地将它命名为 `$`
		// 剩下就都是 jquery 的内容了
		var $ = cheerio.load(sres.text);
		var items = [];
		$('.photo_container .photo_thumbnail .photo ').each(function (idx, element) {
			var $element = $(element);
			console.log($element)
			items.push({
				style: $element.attr('style')
			});
		});
		console.log(items)
		clearInterval(timer);
	});
}, 60 * 1000);

*/



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
