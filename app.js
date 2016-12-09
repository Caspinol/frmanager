const express = require('express');
const app = express();
var path = require('path');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var exhbs = require('express-handlebars');

const passport = require('passport');
var log4js = require('log4js');

var config = require('./config.conf');
log4js.configure(config.logging);
var logger = log4js.getLogger('catdamnit');

app.locals = require('./lib/db')(config.db.driver);

// Configure the templating engine
var hbs = exhbs.create({
    defaultLayout: 'main',
    partialsDir: 'views/partials',
    extname: '.hbs'
});

/* handlebars engine setup */
app.engine('.hbs', hbs.engine);
app.set('views', __dirname + '/views');
app.set('view options', { layout: 'layouts/main' });
app.set('view engine', '.hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(log4js.connectLogger(log4js.getLogger("http"), { level: 'auto' }));

// uncomment after placing your favicon in /public
app
    .use(bodyParser.json())
    .use(bodyParser.urlencoded({ extended: false }))
    .use(cookieParser())
    .use(express.static(path.join(__dirname, '/public')))
    .use(session({
        secret: 'Z|{~:Z|(*^$(@Y$IHJVJBVBN£@asdad/]£$%^',
        resave: true,
        saveUninitialized: true
    }))
    .use(passport.initialize()) /* Set up passport */
    .use(passport.session()); /* Passport will handle login sessions */

require('./lib/auth')(passport, app.locals.db);

/* Routes handlers */
require('./routes/index')(app, passport);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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
