const express = require('express');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { ensureGuest } = require('../middleware/auth');

const router = express.Router();

router.get('/login', ensureGuest, (req, res) => {
  res.render('layout', { title: 'Login - CampNest', view: 'auth/login' });
});

router.post(
  '/login',
  ensureGuest,
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/auth/login',
    failureFlash: true,
  })
);

router.get('/register', ensureGuest, (req, res) => {
  res.render('layout', { title: 'Create account - CampNest', view: 'auth/register' });
});

router.post('/register', ensureGuest, async (req, res) => {
  const { username, email, password, password2 } = req.body;

  if (!username || !email || !password || !password2) {
    req.flash('error_msg', 'Please fill all fields.');
    return res.redirect('/auth/register');
  }
  if (password !== password2) {
    req.flash('error_msg', 'Passwords do not match.');
    return res.redirect('/auth/register');
  }
  if (password.length < 6) {
    req.flash('error_msg', 'Password should be at least 6 characters.');
    return res.redirect('/auth/register');
  }

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    req.flash('error_msg', 'Email is already registered.');
    return res.redirect('/auth/register');
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  const user = await User.create({
    username: username.trim(),
    email: email.toLowerCase().trim(),
    password: hash,
  });

  req.login(user, (err) => {
    if (err) {
      req.flash('error_msg', 'Account created, but login failed. Please login.');
      return res.redirect('/auth/login');
    }
    req.flash('success_msg', 'Welcome to CampNest!');
    return res.redirect('/');
  });
});

router.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    req.flash('success_msg', 'You are logged out.');
    res.redirect('/');
  });
});

module.exports = router;

