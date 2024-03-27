var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');
const cron = require('node-cron');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var productRouter = require('./routes/products');
var cartRouter = require('./routes/cart');
var addressRouter = require('./routes/address');
var ordersRouter = require('./routes/orders');
var emailRouter = require('./routes/email');
const connectDB = require('./db/db');
const orderJob = require('./functions/appFunctions');
const heartbeat = require('./functions/heartBeat');

var app = express();

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');
const corsOptions = {
  AccessControlAllowOrigin: '*',  
  origin: '*',  
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE' 
}
app.use(cors(corsOptions))
app.use(logger('dev'));
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({ extended: false, limit: '50mb' }));
app.use(cookieParser());
app.set('view engine', 'jade');
// app.use(express.static(path.join(__dirname, 'public')));


connectDB();
app.use('/', indexRouter);
app.use('/api/users', usersRouter);
app.use('/api/products', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/address', addressRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/email', emailRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// cron.schedule('0 0 * * *', orderJob);
// cron.schedule('*/5 * * * * *', heartbeat);

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
