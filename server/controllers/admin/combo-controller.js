const Combo = require('../../models/Combo');
const Product = require('../../models/Product');

const createCombo = async (req, res) => {
  try {
    const { name, slug, description, productIds = [], price, originalPrice, image, images = [], active = true, sortOrder = 0 } = req.body;
    if (!name || !slug || typeof price === 'undefined') {
      return res.status(400).json({ success: false, message: 'name, slug & price are required' });
    }
    const combo = await Combo.create({ name, slug, description, productIds, products: productIds, price, originalPrice, image, images, active, sortOrder });
    const populated = await Combo.findById(combo._id).populate('productIds');
    res.status(201).json({ success: true, data: populated });
  } catch (e) {
    console.error(e);res.status(500).json({ success:false, message:'Failed to create combo'});
  }
};

const listCombos = async (_req, res) => {
  try {
    const combos = await Combo.find({}).sort({ sortOrder:1, createdAt:-1 }).populate('productIds');
    res.json({ success:true, data: combos });
  } catch (e){ console.error(e); res.status(500).json({ success:false, message:'Failed to fetch combos' }); }
};

const getCombo = async (req,res) => {
  try {
    const combo = await Combo.findById(req.params.id).populate('productIds');
    if (!combo) return res.status(404).json({ success:false, message:'Combo not found' });
    res.json({ success:true, data: combo });
  } catch(e){ console.error(e); res.status(500).json({ success:false, message:'Failed to fetch combo' }); }
};

const updateCombo = async (req,res) => {
  try {
    const { id } = req.params;
    const combo = await Combo.findById(id);
    if (!combo) return res.status(404).json({ success:false, message:'Combo not found' });
    const fields = ['name','slug','description','price','originalPrice','image','active','sortOrder'];
    fields.forEach(f => { if (typeof req.body[f] !== 'undefined') combo[f] = req.body[f]; });
    if (Array.isArray(req.body.productIds)) { combo.productIds = req.body.productIds; combo.products = req.body.productIds; }
    if (Array.isArray(req.body.images)) combo.images = req.body.images.slice(0,10);
    await combo.save();
    const populated = await Combo.findById(id).populate('productIds');
    res.json({ success:true, data: populated });
  } catch(e){ console.error(e); res.status(500).json({ success:false, message:'Failed to update combo' }); }
};

const deleteCombo = async (req,res) => {
  try {
    const { id } = req.params;
    const deleted = await Combo.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ success:false, message:'Combo not found' });
    res.json({ success:true, message:'Combo deleted' });
  } catch(e){ console.error(e); res.status(500).json({ success:false, message:'Failed to delete combo' }); }
};

module.exports = { createCombo, listCombos, getCombo, updateCombo, deleteCombo };
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
