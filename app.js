var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const dbNormalize = require('./routes/dbNormalize');
const rootNormalize = require('./routes/rootNormalize');
const createTable = require('./routes/createTable');
const addData = require('./routes/addData');
const getTable = require('./routes/getTable')

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/workbench', indexRouter);
app.use('/users', usersRouter);
app.use('/rootNormalize',rootNormalize);
app.use('/dbNormalize',dbNormalize);
app.use('/createTable',createTable);
app.use('/addData',addData);
app.use('/getTable',getTable);

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
