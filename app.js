var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const db = require('./config/db')
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload')
const session = require('express-session');
// const paginate = require('express-paginate');
const flash = require('connect-flash');
var MemoryStore = require('memorystore')(session)
var userRouter = require('./routes/user');
var signupRouter = require('./routes/signup');

//db connection error or not
db.on('error', function(err){
  console.log(err);
});

db.once('open', function(){
  console.log("Connected to mongodb");
});



var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json());
app.use(fileUpload())

//Express session middleware
app.use(session({
  cookie: { maxAge: 86400000 },
  name: "express-session",
  store: new MemoryStore({
    checkPeriod: 86400000 // delete expired entries every 24h
  }),
  secret: 'My secret',
  resave: false,
  saveUninitialized: true,
}));

//Express messages middleware
app.use(flash());
app.use(function (req, res, next) {  
  res.locals.messages = require('express-messages')(req, res);
  next();
});

app.use('/user', signupRouter)
app.use(function(req, res, next){
  if (!req.session.username && req.path != '/login') {
      res.redirect('/login')
  } else {
      next();
  }
})

app.use('/', userRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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
