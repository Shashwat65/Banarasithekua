const Banner = require('../../models/Banner');

const listBanners = async (_req, res) => {
  try {
    const banners = await Banner.find({}).sort({ sortOrder: 1, createdAt: -1 });
    res.json({ success: true, data: banners });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: 'Failed to fetch banners' });
  }
};

const createBanner = async (req, res) => {
  try {
    const { title, imageUrl, public_id, link, position = 'main', active = true, sortOrder = 0, width, height } = req.body || {};
    
    if (!imageUrl) {
      return res.status(400).json({ success: false, message: 'Image URL is required' });
    }

    const banner = await Banner.create({
      title,
      imageUrl,
      public_id,
      link,
      position,
      active: typeof active === 'boolean' ? active : true,
      sortOrder: Number(sortOrder) || 0,
      width: Number(width) || undefined,
      height: Number(height) || undefined,
    });

    res.status(201).json({ success: true, data: banner });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: 'Failed to add banner' });
  }
};

const updateBanner = async (req, res) => {
  try {
    const { id } = req.params;
    const banner = await Banner.findById(id);
    if (!banner) return res.status(404).json({ success: false, message: 'Banner not found' });

    const fields = ['title', 'imageUrl', 'public_id', 'link', 'position', 'active', 'sortOrder', 'width', 'height'];
    fields.forEach((field) => {
      if (typeof req.body[field] !== 'undefined') {
        banner[field] = req.body[field];
      }
    });

    await banner.save();
    res.json({ success: true, data: banner });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: 'Failed to update banner' });
  }
};

const deleteBanner = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Banner.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Banner not found' });
    res.json({ success: true, message: 'Banner deleted' });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: 'Failed to delete banner' });
  }
};

module.exports = { listBanners, createBanner, updateBanner, deleteBanner };
