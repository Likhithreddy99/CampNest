const express = require('express');
const campService = require('../services/camp.service');
const { ensureAuth, ensureOwnerOrAdmin } = require('../middleware/auth');
const { upload } = require('../config/upload');
const Camp = require('../models/Camp');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const camps = await campService.getAllCamps();
    res.json(camps);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post(
  '/',
  ensureAuth,
  upload.single('imageFile'),
  async (req, res) => {
    try {
      const { title, location, description, imageUrl, tags } = req.body;
      const finalImageUrl = req.file ? `/uploads/${req.file.filename}` : imageUrl;

      const camp = await campService.createCamp({
        title,
        location,
        description,
        imageUrl: finalImageUrl,
        tags,
        authorId: req.user._id,
      });

      res.status(201).json(camp);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
);

router.put(
  '/:id',
  ensureAuth,
  ensureOwnerOrAdmin(async (req) => {
    const camp = await Camp.findById(req.params.id);
    return camp?.author;
  }),
  upload.single('imageFile'),
  async (req, res) => {
    try {
      const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
      const camp = await campService.updateCamp(req.params.id, {
        ...req.body,
        imageUrl,
      });

      if (!camp) return res.status(404).json({ error: 'Campsite not found' });
      res.json(camp);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
);

router.get('/:id', async (req, res) => {
  try {
    const data = await campService.getCampById(req.params.id);
    if (!data) return res.status(404).json({ error: 'Campsite not found' });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/:id/reviews', ensureAuth, async (req, res) => {
  try {
    const rating = Number(req.body.rating);
    const comment = String(req.body.comment || '').trim();

    if (!rating || rating < 1 || rating > 5 || !comment) {
      return res.status(400).json({ error: 'Please provide a rating (1–5) and a comment.' });
    }

    const updatedCamp = await campService.addReview(req.params.id, {
      rating,
      comment,
      authorId: req.user._id,
    });

    res.json(updatedCamp);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
