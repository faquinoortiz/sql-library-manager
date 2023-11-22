var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var app = express();


app.use(express.json());
// Sets up static middleware to serve files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Import routes
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var booksRouter = require('./routes/books');

// Use routes
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/books', booksRouter);

// Catch 404 and forward to the error handler
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
  res.status(err.status || 500);
  res.render('error');
});

// Set up database connection
const sequelize = require('./models/index').sequelize;
sequelize.authenticate()
  .then(() => {
    console.log('Connection to the database has been established successfully');
    return sequelize.sync();
  })
  .then(() => {
    console.log('Models are synced with the database');
  })
  .catch((err) => {
    console.error('Unable to connect to the database or sync models:', err);
  });

app.set('view engine', 'pug');

module.exports = app;