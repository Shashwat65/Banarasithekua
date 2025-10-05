// Clean consolidated Combo controller (removes prior duplicated blocks)
const Combo = require('../../models/Combo');

// Create combo (supports productIds/products + images array)
const createCombo = async (req, res) => {
  try {
    const { name, slug, description, productIds = [], products = [], price, originalPrice, image, images = [], active = true, sortOrder = 0 } = req.body;
    if (!name || !slug || typeof price === 'undefined') {
      return res.status(400).json({ success: false, message: 'name, slug & price are required' });
    }
    // Harmonize arrays (prefer productIds; fall back to products)
    const finalProductIds = Array.isArray(productIds) && productIds.length > 0 ? productIds : products;
    const combo = await Combo.create({
      name,
      slug,
      description,
      productIds: finalProductIds,
      products: finalProductIds, // keep legacy field in sync
      price,
      originalPrice,
      image,
      images: Array.isArray(images) ? images.slice(0, 10) : [],
      active,
      sortOrder: Number(sortOrder) || 0,
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
    const combo = await Combo.findById(id);
    if (!combo) return res.status(404).json({ success: false, message: 'Combo not found' });
    const fields = ['name', 'slug', 'description', 'price', 'originalPrice', 'image', 'active', 'sortOrder'];
    fields.forEach(f => { if (typeof req.body[f] !== 'undefined') combo[f] = f === 'sortOrder' ? Number(req.body[f]) : req.body[f]; });
    if (Array.isArray(req.body.productIds)) {
      combo.productIds = req.body.productIds;
      combo.products = req.body.productIds; // sync legacy
    } else if (Array.isArray(req.body.products)) { // fallback
      combo.productIds = req.body.products;
      combo.products = req.body.products;
    }
    if (Array.isArray(req.body.images)) combo.images = req.body.images.slice(0, 10);
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
