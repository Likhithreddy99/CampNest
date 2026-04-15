const express = require('express');
const storyService = require('../services/story.service');
const { ensureAuth, ensureOwnerOrAdmin } = require('../middleware/auth');
const { upload } = require('../config/upload');
const Story = require('../models/Story');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const stories = await storyService.getAllStories();
    res.json(stories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post(
  '/',
  ensureAuth,
  upload.single('coverImageFile'),
  async (req, res) => {
    try {
      const { title, content, coverImageUrl, tags } = req.body;
      const finalCoverImageUrl = req.file ? `/uploads/${req.file.filename}` : coverImageUrl;

      const story = await storyService.createStory({
        title,
        content,
        coverImageUrl: finalCoverImageUrl,
        tags,
        authorId: req.user._id,
      });

      res.status(201).json(story);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
);

router.put(
  '/:id',
  ensureAuth,
  ensureOwnerOrAdmin(async (req) => {
    const story = await Story.findById(req.params.id);
    return story?.author;
  }),
  upload.single('coverImageFile'),
  async (req, res) => {
    try {
      const coverImageUrl = req.file ? `/uploads/${req.file.filename}` : req.body.coverImageUrl;
      const story = await storyService.updateStory(req.params.id, {
        ...req.body,
        coverImageUrl,
      });

      if (!story) return res.status(404).json({ error: 'Story not found' });
      res.json(story);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
);

router.get('/:id', async (req, res) => {
  try {
    const story = await storyService.getStoryById(req.params.id);
    if (!story) return res.status(404).json({ error: 'Story not found' });
    res.json(story);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
