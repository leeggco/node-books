var express = require('express');
var path = require('path');
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

// view engine setup

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

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
