const express = require('express');
const passport = require('passport');
const authService = require('../services/auth.service');

const router = express.Router();

router.get('/user', (req, res) => {
  if (req.isAuthenticated()) {
    res.json(req.user);
  } else {
    res.json(null);
  }
});

router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(401).json({ message: info.message || 'Login failed' });

    req.logIn(user, (err) => {
      if (err) return next(err);
      return res.json({ message: 'Success', user });
    });
  })(req, res, next);
});

router.post('/register', async (req, res) => {
  const { username, email, password, password2 } = req.body;

  if (!username || !email || !password || !password2) {
    return res.status(400).json({ message: 'Please fill all fields' });
  }
  if (password !== password2) {
    return res.status(400).json({ message: 'Passwords do not match' });
  }
  if (password.length < 6) {
    return res.status(400).json({ message: 'Password should be at least 6 characters' });
  }

  try {
    const user = await authService.registerUser({ username, email, password });
    
    req.login(user, (err) => {
      if (err) return res.status(500).json({ message: 'Account created, but login failed.' });
      return res.json({ message: 'Success', user });
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.json({ message: 'Logged out' });
  });
});

module.exports = router;
