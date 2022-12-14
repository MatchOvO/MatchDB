const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const fs = require('fs')

const config = fs.readFileSync('./config.json','utf8')
const usersRouter = require('./routes/users');
const dbNormalize = require('./routes/dbNormalize');
const rootNormalize = require('./routes/rootNormalize');
const createTable = require('./routes/createTable');
const addData = require('./routes/addData');
const getTable = require('./routes/getTable');
const getTableData = require('./routes/getTableData');
const deleteData = require('./routes/deleteData')
const getData = require('./routes/getData');
const updateData = require('./routes/updateData');
const getWhere = require('./routes/getWhere');
const deleteWhere = require('./routes/deleteWhere');
const updateWhere = require('./routes/updateWhere')

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.set('config',config)

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
/**
 *  Routers
 * */
app.use('/users', usersRouter);
app.use('/rootNormalize',rootNormalize);
app.use('/dbNormalize',dbNormalize);
app.use('/createTable',createTable);
app.use('/addData',addData);
app.use('/getTable',getTable);
app.use('/getTableData',getTableData);
app.use('/deleteData',deleteData);
app.use('/getData',getData);
app.use('/updateData',updateData);
app.use('/getWhere',getWhere);
app.use('/deleteWhere',deleteWhere);
app.use('/updateWhere',updateWhere);

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
