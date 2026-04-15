const express = require('express');
const { ensureAuth } = require('../middleware/auth');
const campService = require('../services/camp.service');
const storyService = require('../services/story.service');

const router = express.Router();

router.get('/', ensureAuth, async (req, res) => {
  try {
    const camps = await campService.getCampsByUser(req.user._id);
    const stories = await storyService.getStoriesByUser(req.user._id);

    res.json({
      camps,
      stories,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
