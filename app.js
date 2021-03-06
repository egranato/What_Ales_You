require('dotenv').config();
const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require("express-session");
const passport = require('passport');
require("./passport");

const landing = require('./routes/landing');
const dash = require('./routes/dash');
const settingsRoutes = require('./routes/settings');
const brewery = require('./routes/brewery');
const nearby = require('./routes/nearby');
const rate = require('./routes/rate');
const authRoutes = require("./routes/auth");
const beersRoutes = require("./routes/beers");
const users = require('./routes/users');
const hbs = require('hbs');
hbs.registerHelper('dateFormat', require('handlebars-dateformat'));
hbs.registerHelper("safefloat", function(value, options) {
    if (value === "NaN") {
        return "-";
    }

    return value;
});

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors())

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(session({ secret: process.env.session_secret, resave: false, saveUninitialized: false }));
// !!!Must do app.use(passport...) after app.use(session...) above.
app.use(passport.initialize());
app.use(passport.session());
app.use(authRoutes);

// Look at next four lines to ensure landing page and index working.  Delete index.js?
//var index = require('./routes/index');
//var landing = require('./routes/landing');
// app.use('/', index);
// app.use('/landing', landing);

app.use('/users', users);
app.use('/dash', dash);
app.use('/brewery', brewery);
app.use('/beers', beersRoutes);
app.use('/nearby', nearby);
app.use('/rate', rate);
app.use('/settings', settingsRoutes);

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
