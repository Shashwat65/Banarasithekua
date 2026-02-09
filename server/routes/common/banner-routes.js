const express = require('express');
const Banner = require('../../models/Banner');

const router = express.Router();

// Get all active banners
router.get('/', async (req, res) => {
  try {
    const { position } = req.query;
    const query = { active: true };
    if (position) query.position = position;
    
    const banners = await Banner.find(query).sort({ sortOrder: 1, createdAt: -1 });
    res.json({ success: true, data: banners });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: 'Failed to fetch banners' });
  }
});

module.exports = router;
