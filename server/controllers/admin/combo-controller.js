const Combo = require('../../models/Combo');
const Product = require('../../models/Product');

// Create combo
const createCombo = async (req, res) => {
  try {
    const { name, slug, description, products = [], price, originalPrice, image, active } = req.body;
    if (!name || !slug) return res.status(400).json({ success: false, message: 'Name & slug required' });
    const combo = await Combo.create({ name, slug, description, products, price, originalPrice, image, active });
    res.status(201).json({ success: true, data: combo });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: 'Failed to create combo' });
  }
};

// List combos (admin full)
const listCombos = async (req, res) => {
  try {
    const combos = await Combo.find({}).populate('products');
    res.json({ success: true, data: combos });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: 'Failed to fetch combos' });
  }
};

// Public active combos
const listActiveCombos = async (_req, res) => {
  try {
    const combos = await Combo.find({ active: true }).populate('products');
    res.json({ success: true, data: combos });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: 'Failed to fetch combos' });
  }
};

// Update combo
const updateCombo = async (req, res) => {
  try {
    const { id } = req.params;
    const combo = await Combo.findById(id);
    if (!combo) return res.status(404).json({ success: false, message: 'Combo not found' });
    const fields = ['name','slug','description','products','price','originalPrice','image','active'];
    fields.forEach(f => { if (typeof req.body[f] !== 'undefined') combo[f] = req.body[f]; });
    await combo.save();
    res.json({ success: true, data: combo });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: 'Failed to update combo' });
  }
};

// Delete combo
const deleteCombo = async (req, res) => {
  try {
    const { id } = req.params;
    const combo = await Combo.findByIdAndDelete(id);
    if (!combo) return res.status(404).json({ success: false, message: 'Combo not found' });
    res.json({ success: true, message: 'Combo deleted' });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: 'Failed to delete combo' });
  }
};

module.exports = { createCombo, listCombos, updateCombo, deleteCombo, listActiveCombos };
