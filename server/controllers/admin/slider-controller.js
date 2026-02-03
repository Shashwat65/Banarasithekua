const SliderImage = require('../../models/SliderImage');

const listSliderImages = async (_req, res) => {
  try {
    const images = await SliderImage.find({}).sort({ sortOrder: 1, createdAt: -1 });
    res.json({ success: true, data: images });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: 'Failed to fetch slider images' });
  }
};

const createSliderImage = async (req, res) => {
  try {
    const { url, public_id, width, height, active = true, sortOrder = 0 } = req.body || {};
    if (!url) {
      return res.status(400).json({ success: false, message: 'Image URL is required' });
    }
    const image = await SliderImage.create({
      url,
      public_id,
      width,
      height,
      active: typeof active === 'boolean' ? active : true,
      sortOrder: Number(sortOrder) || 0,
    });
    res.status(201).json({ success: true, data: image });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: 'Failed to add slider image' });
  }
};

const updateSliderImage = async (req, res) => {
  try {
    const { id } = req.params;
    const image = await SliderImage.findById(id);
    if (!image) return res.status(404).json({ success: false, message: 'Slider image not found' });
    ['url', 'public_id', 'width', 'height', 'active', 'sortOrder'].forEach((field) => {
      if (typeof req.body[field] !== 'undefined') image[field] = req.body[field];
    });
    if (typeof req.body.sortOrder !== 'undefined') image.sortOrder = Number(req.body.sortOrder) || 0;
    await image.save();
    res.json({ success: true, data: image });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: 'Failed to update slider image' });
  }
};

const deleteSliderImage = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await SliderImage.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Slider image not found' });
    res.json({ success: true, message: 'Slider image deleted' });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: 'Failed to delete slider image' });
  }
};

module.exports = { listSliderImages, createSliderImage, updateSliderImage, deleteSliderImage };
