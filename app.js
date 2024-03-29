var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var { cfTts } = require('./routes/functions');
const loggerRouter = require('./routes/loggerRouter');
const { wLogger } = require('./routes/logger');

var app = express();

global.authToken = '';

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(loggerRouter);

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    wLogger.error(`${err.status} ${err.message}`);
    //res.status(err.status || 500);
    res.json(
        cfTts(
            `Sorry, there was an error! error code: ${err.status ? err.status.toString().split('') : '5,0,0'}, please try again later, if the issue persists please contact support. error details: ${err.message}`
        )
    );
});

module.exports = app;
