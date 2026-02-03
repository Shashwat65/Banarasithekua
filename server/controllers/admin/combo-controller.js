const Combo = require('../../models/Combo');
const { generateUniqueSlug, slugify } = require('../../utils/slug');

const normalizeProducts = (body) => {
  if (Array.isArray(body.productIds) && body.productIds.length > 0) return body.productIds;
  if (Array.isArray(body.products) && body.products.length > 0) return body.products;
  return [];
};

// Create combo
const createCombo = async (req, res) => {
  try {
    const body = req.body || {};
    const name = body.name;
    if (!name || typeof body.price === 'undefined') {
      return res.status(400).json({ success: false, message: 'name and price are required' });
    }
    const rawSlug = body.slug || slugify(name);
    const slug = await generateUniqueSlug(Combo, rawSlug);
    const products = normalizeProducts(body);
    const images = Array.isArray(body.images) ? body.images.slice(0, 10) : [];
    const image = body.image || images[0]?.url;

    const combo = await Combo.create({
      name,
      slug,
      description: body.description,
      productIds: products,
      products,
      price: body.price,
      originalPrice: body.originalPrice,
      image,
      images,
      active: typeof body.active === 'boolean' ? body.active : true,
      sortOrder: Number(body.sortOrder) || 0,
    });

    const populated = await Combo.findById(combo._id).populate('productIds');
    res.status(201).json({ success: true, data: populated });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: 'Failed to create combo' });
  }
};

// Admin list (all combos)
const listCombos = async (_req, res) => {
  try {
    const combos = await Combo.find({}).sort({ sortOrder: 1, createdAt: -1 }).populate('productIds');
    res.json({ success: true, data: combos });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: 'Failed to fetch combos' });
  }
};

// Public list (only active combos)
const listActiveCombos = async (_req, res) => {
  try {
    const combos = await Combo.find({ active: true }).sort({ sortOrder: 1, createdAt: -1 }).populate('productIds');
    res.json({ success: true, data: combos });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: 'Failed to fetch combos' });
  }
};

// Fetch single combo
const getCombo = async (req, res) => {
  try {
    const combo = await Combo.findById(req.params.id).populate('productIds');
    if (!combo) return res.status(404).json({ success: false, message: 'Combo not found' });
    res.json({ success: true, data: combo });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: 'Failed to fetch combo' });
  }
};

// Update combo
const updateCombo = async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body || {};
    const combo = await Combo.findById(id);
    if (!combo) return res.status(404).json({ success: false, message: 'Combo not found' });

    if (body.name) combo.name = body.name;
    if (body.slug || body.name) {
      const baseSlug = body.slug || body.name || combo.slug;
      combo.slug = await generateUniqueSlug(Combo, baseSlug, combo._id);
    }
    if (typeof body.description !== 'undefined') combo.description = body.description;
    if (typeof body.price !== 'undefined') combo.price = body.price;
    if (typeof body.originalPrice !== 'undefined') combo.originalPrice = body.originalPrice;
    if (typeof body.image !== 'undefined') combo.image = body.image;
    if (typeof body.active !== 'undefined') combo.active = body.active;
    if (typeof body.sortOrder !== 'undefined') combo.sortOrder = Number(body.sortOrder) || 0;

    if (Array.isArray(body.productIds) || Array.isArray(body.products)) {
      const nextProducts = normalizeProducts(body);
      combo.productIds = nextProducts;
      combo.products = nextProducts;
    }
    if (Array.isArray(body.images)) combo.images = body.images.slice(0, 10);

    await combo.save();
    const populated = await Combo.findById(id).populate('productIds');
    res.json({ success: true, data: populated });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: 'Failed to update combo' });
  }
};

// Delete combo
const deleteCombo = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Combo.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Combo not found' });
    res.json({ success: true, message: 'Combo deleted' });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: 'Failed to delete combo' });
  }
};

module.exports = { createCombo, listCombos, listActiveCombos, getCombo, updateCombo, deleteCombo };
