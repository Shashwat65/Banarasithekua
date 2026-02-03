const SliderImage = require('../../models/SliderImage');

const listActiveSliderImages = async (_req, res) => {
  try {
    const images = await SliderImage.find({ active: true }).sort({ sortOrder: 1, createdAt: -1 });
    res.json({ success: true, data: images });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: 'Failed to fetch slider images' });
  }
};

module.exports = { listActiveSliderImages };
