const express = require('express');
const Story = require('../models/Story');
const { ensureAuth, ensureOwnerOrAdmin } = require('../middleware/auth');
const { upload } = require('../config/upload');

const router = express.Router();

/* ===========================
   INDEX – all stories
=========================== */
router.get('/', async (req, res) => {
  const stories = await Story.find({})
    .populate('author')
    .sort({ createdAt: -1 });

  res.render('layout', {
    title: 'Stories - CampNest',
    view: 'stories/index',
    stories,
  });
});

/* ===========================
   NEW – form
=========================== */
router.get('/new', ensureAuth, (req, res) => {
  res.render('layout', {
    title: 'New Story - CampNest',
    view: 'stories/new',
  });
});

/* ===========================
   CREATE – submit new story
=========================== */
router.post(
  '/',
  ensureAuth,
  upload.single('coverImageFile'),
  async (req, res) => {
    const { title, content, coverImageUrl, tags } = req.body;

    const finalCoverImageUrl = req.file
      ? `/uploads/${req.file.filename}`
      : coverImageUrl;

    const story = await Story.create({
      title,
      content,
      coverImageUrl: finalCoverImageUrl,
      tags: (tags || '')
        .split(',')
        .map(t => t.trim())
        .filter(Boolean),
      author: req.user._id,
    });

    req.flash('success_msg', 'Story published!');
    res.redirect(`/stories/${story._id}`);
  }
);

/* ===========================
   EDIT – form (OWNER / ADMIN)
=========================== */
router.get(
  '/:id/edit',
  ensureAuth,
  ensureOwnerOrAdmin(async (req) => {
    const story = await Story.findById(req.params.id);
    return story?.author;
  }),
  async (req, res) => {
    const story = await Story.findById(req.params.id);

    if (!story) {
      req.flash('error_msg', 'Story not found.');
      return res.redirect('/stories');
    }

    res.render('layout', {
      title: 'Edit Story - CampNest',
      view: 'stories/edit',
      story,
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
    const story = await Story.findById(req.params.id);
    return story?.author;
  }),
  upload.single('coverImageFile'),
  async (req, res) => {
    const { title, content, coverImageUrl, tags } = req.body;
    const story = await Story.findById(req.params.id);

    if (!story) {
      req.flash('error_msg', 'Story not found.');
      return res.redirect('/stories');
    }

    // Image replace logic
    if (req.file) {
      story.coverImageUrl = `/uploads/${req.file.filename}`;
    } else if (coverImageUrl) {
      story.coverImageUrl = coverImageUrl;
    }

    story.title = title;
    story.content = content;
    story.tags = (tags || '')
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    await story.save();

    req.flash('success_msg', 'Story updated!');
    res.redirect(`/stories/${story._id}`);
  }
);

/* ===========================
   SHOW – single story
=========================== */
router.get('/:id', async (req, res) => {
  const story = await Story.findById(req.params.id).populate('author');

  if (!story) {
    req.flash('error_msg', 'Story not found.');
    return res.redirect('/stories');
  }

  res.render('layout', {
    title: `${story.title} - CampNest`,
    view: 'stories/show',
    story,
  });
});

module.exports = router;
