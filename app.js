var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
require('dotenv').config(); 

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var newsRouter = require('./routes/news'); // Added news routes
var authRouter = require('./routes/auth'); // Added authentication routes

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use("/images", express.static(path.join(__dirname, "/public/images")));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Passport and Session Setup
const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const User = require('./models/User');

// MongoDB Connection
const mongoose = require('mongoose');
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.log(err));

// Session Setup
app.use(
  session({
    secret: 'newsappabhinavnitin',
    resave: false,
    saveUninitialized: true,
  })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Passport Local Strategy
passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await User.findOne({ username });
      if (!user) return done(null, false, { message: 'User not found' });
      const isMatch = await user.comparePassword(password);
      if (!isMatch) return done(null, false, { message: 'Incorrect password' });
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

// Passport GitHub Strategy
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_CALLBACK,
    },
    (accessToken, refreshToken, profile, done) => {
      done(null, profile); // Use GitHub profile as user object
    }
  )
);

// Routes
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/news', newsRouter); // Use the news router
app.use('/auth', authRouter); // Use the auth router

// Catch 404 and Forward to Error Handler
app.use(function (req, res, next) {
  next(createError(404));
});

// Error Handler
app.use(function (err, req, res, next) {
  // Set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // Render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
