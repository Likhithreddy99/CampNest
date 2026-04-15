const express = require('express');
const campService = require('../services/camp.service');
const storyService = require('../services/story.service');

const router = express.Router();

router.get('/', async (req, res) => {
  const q = (req.query.q || '').trim();

  if (!q) {
    return res.status(400).json({ error: 'Search query is required' });
  }

  try {
    const [camps, stories] = await Promise.all([
      campService.searchCamps(q),
      storyService.searchStories(q)
    ]);

    res.json({
      query: q,
      camps,
      stories,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
