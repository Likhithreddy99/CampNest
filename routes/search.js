const express = require('express');
const Camp = require('../models/Camp');
const Story = require('../models/Story');

const router = express.Router();

router.get('/', async (req, res) => {
  const q = (req.query.q || '').trim();

  if (!q) {
    return res.redirect('/');
  }

  let camps = [];
  let stories = [];

  try {
    camps = await Camp.find({
      $or: [
        { title: { $regex: q, $options: 'i' } },
        { location: { $regex: q, $options: 'i' } },
        { tags: { $regex: q, $options: 'i' } },
      ],
    });

    stories = await Story.find({
      $or: [
        { title: { $regex: q, $options: 'i' } },
        { content: { $regex: q, $options: 'i' } },
        { tags: { $regex: q, $options: 'i' } },
      ],
    }).populate('author');
  } catch (err) {
    console.error('Search error:', err);
  }

  res.render('layout', {
    title: `Search: ${q} - CampNest`,
    view: 'search/results',
    query: q,
    camps,          // ALWAYS defined
    stories,        // ALWAYS defined
  });
});

module.exports = router;
