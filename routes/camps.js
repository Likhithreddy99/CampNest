const express = require('express');
const Camp = require('../models/Camp');
const Review = require('../models/Review');
const { ensureAuth, ensureOwnerOrAdmin } = require('../middleware/auth');
const { upload } = require('../config/upload');

const router = express.Router();

/* ===========================
   INDEX – all camps
=========================== */
router.get('/', async (req, res) => {
  const camps = await Camp.find({})
    .sort({ createdAt: -1 })
    .populate('author');

  res.render('layout', {
    title: 'Campsites - CampNest',
    view: 'camps/index',
    camps,
  });
});

/* ===========================
   NEW – form
=========================== */
router.get('/new', ensureAuth, (req, res) => {
  res.render('layout', {
    title: 'New Campsite - CampNest',
    view: 'camps/new',
  });
});

/* ===========================
   CREATE – submit new campsite
=========================== */
router.post(
  '/',
  ensureAuth,
  upload.single('imageFile'),
  async (req, res) => {
    const { title, location, description, imageUrl, tags } = req.body;

    const finalImageUrl = req.file
      ? `/uploads/${req.file.filename}`
      : imageUrl;

    const camp = await Camp.create({
      title,
      location,
      description,
      imageUrl: finalImageUrl,
      tags: (tags || '')
        .split(',')
        .map(t => t.trim())
        .filter(Boolean),
      author: req.user._id,
    });

    req.flash('success_msg', 'Campsite posted!');
    res.redirect(`/camps/${camp._id}`);
  }
);

/* ===========================
   EDIT – form (OWNER / ADMIN)
=========================== */
router.get(
  '/:id/edit',
  ensureAuth,
  ensureOwnerOrAdmin(async (req) => {
    const camp = await Camp.findById(req.params.id);
    return camp?.author;
  }),
  async (req, res) => {
    const camp = await Camp.findById(req.params.id);

    if (!camp) {
      req.flash('error_msg', 'Campsite not found.');
      return res.redirect('/camps');
    }

    res.render('layout', {
      title: 'Edit Campsite - CampNest',
      view: 'camps/edit',
      camp,
    });
  }
);

/* ===========================
   UPDATE – save edits
=========================== */
router.put(
  '/:id',
  ensureAuth,
  ensureOwnerOrAdmin(async (req) => {
    const camp = await Camp.findById(req.params.id);
    return camp?.author;
  }),
  upload.single('imageFile'),
  async (req, res) => {
    const { title, location, description, tags } = req.body;
    const camp = await Camp.findById(req.params.id);

    if (!camp) {
      req.flash('error_msg', 'Campsite not found.');
      return res.redirect('/camps');
    }

    // Image replace
    if (req.file) {
      camp.imageUrl = `/uploads/${req.file.filename}`;
    }

    camp.title = title;
    camp.location = location;
    camp.description = description;
    camp.tags = (tags || '')
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    await camp.save();

    req.flash('success_msg', 'Campsite updated!');
    res.redirect(`/camps/${camp._id}`);
  }
);

/* ===========================
   SHOW – single campsite
=========================== */
router.get('/:id', async (req, res) => {
  const camp = await Camp.findById(req.params.id).populate('author');

  if (!camp) {
    req.flash('error_msg', 'Campsite not found.');
    return res.redirect('/camps');
  }

  const reviews = await Review.find({ camp: camp._id })
    .populate('author')
    .sort({ createdAt: -1 });

  res.render('layout', {
    title: `${camp.title} - CampNest`,
    view: 'camps/show',
    camp,
    reviews,
  });
});

/* ===========================
   ADD REVIEW
=========================== */
router.post('/:id/reviews', ensureAuth, async (req, res) => {
  const camp = await Camp.findById(req.params.id);

  if (!camp) {
    req.flash('error_msg', 'Campsite not found.');
    return res.redirect('/camps');
  }

  const rating = Number(req.body.rating);
  const comment = String(req.body.comment || '').trim();

  if (!rating || rating < 1 || rating > 5 || !comment) {
    req.flash('error_msg', 'Please provide a rating (1–5) and a comment.');
    return res.redirect(`/camps/${camp._id}`);
  }

  await Review.create({
    rating,
    comment,
    camp: camp._id,
    author: req.user._id,
  });

  // Recompute average rating
  const agg = await Review.aggregate([
    { $match: { camp: camp._id } },
    { $group: { _id: '$camp', avg: { $avg: '$rating' } } },
  ]);

  camp.averageRating = agg[0]?.avg || 0;
  await camp.save();

  req.flash('success_msg', 'Review added. Thanks!');
  res.redirect(`/camps/${camp._id}`);
});

module.exports = router;
