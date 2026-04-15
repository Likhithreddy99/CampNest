const express = require('express');
const campService = require('../services/camp.service');
const storyService = require('../services/story.service');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const trendingCamps = await campService.getTrendingCamps(6);
    const latestStories = await storyService.getLatestStories(6);
    
    res.json({
      trendingCamps,
      latestStories,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
