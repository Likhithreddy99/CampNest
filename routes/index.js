const express = require('express');
const Camp = require('../models/Camp');
const Story = require('../models/Story');

const router = express.Router();

router.get('/', async (req, res) => {
  const trendingCamps = await Camp.find({}).sort({ averageRating: -1, createdAt: -1 }).limit(6);
  const latestStories = await Story.find({}).populate('author').sort({ createdAt: -1 }).limit(6);
  res.render('layout', {
    title: 'CampNest',
    view: 'index',
    trendingCamps,
    latestStories,
  });
});

module.exports = router;

