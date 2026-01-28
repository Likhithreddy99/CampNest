const express = require('express');
const { ensureAuth } = require('../middleware/auth');
const Camp = require('../models/Camp');
const Story = require('../models/Story');

const router = express.Router();

router.get('/', ensureAuth, async (req, res) => {
  const camps = await Camp.find({ author: req.user._id });
  const stories = await Story.find({ author: req.user._id });

  res.render('layout', {
    title: 'My Profile - CampNest',
    view: 'profile/index',
    camps,
    stories,
  });
});

module.exports = router;
