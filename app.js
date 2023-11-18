var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var app = express();

//Sets up static middleware to serve files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Import routes
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

// Use routes
app.use('/', indexRouter);
app.use('/users', usersRouter);

// Catch 404 and forward to error handler
app.use((req, res, next) => {
  const error = new Error('Not Found');
  error.status = 404;
  next(error);
});

// Error handler
app.use((err, req, res, next) => {

  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  
  console.error(`Error ${err.status || 500}: ${err.message}`);

  // Render the error page
  res.status(err.status || 500);
  res.render('error');
});

// Set up database connection
const sequelize = require('./models/index').sequelize;
sequelize.authenticate()
  .then(() => {
    console.log('Connection to database has been established successfully');
    return sequelize.sync();  // Sync the models with the database
  })
  .then(() => {
    console.log('Models are synced with the database');
  })
  .catch((err) => {
    console.error('Unable to connect to the database or sync models:', err);
  });


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// Other middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

module.exports = app;