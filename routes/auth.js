const express = require('express');
const passport = require('passport');
const router = express.Router();
const User = require('../models/User');

// Register
router.get('/register', (req, res) => res.render('auth/register'));
router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const user = new User({ username, password });
  await user.save();
  res.redirect('/auth/login');
});

// Login
router.get('/login', (req, res) => res.render('auth/login'));
router.post('/login', passport.authenticate('local', {
  successRedirect: '/news',
  failureRedirect: '/auth/login',
}));

// GitHub Login
router.get('/github', passport.authenticate('github'));
router.get(
  '/github/callback',
  passport.authenticate('github', { failureRedirect: '/auth/login' }),
  (req, res) => {
    res.redirect('/news');
  }
);

// Logout
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

module.exports = router;
