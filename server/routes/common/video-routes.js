const express = require('express');
const VideoReview = require('../../models/VideoReview');
const { incrementViews } = require('../../controllers/admin/video-controller');

const router = express.Router();

// Get all active videos
router.get('/', async (_req, res) => {
  try {
    const videos = await VideoReview.find({ active: true }).sort({ sortOrder: 1, createdAt: -1 });
    res.json({ success: true, data: videos });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: 'Failed to fetch videos' });
  }
});

// Increment video views
router.post('/:id/view', incrementViews);

module.exports = router;
