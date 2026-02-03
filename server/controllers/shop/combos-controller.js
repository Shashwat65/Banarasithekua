const Combo = require('../../models/Combo');
const mongoose = require('mongoose');

const listActiveCombos = async (_req, res) => {
  try {
    const combos = await Combo.find({ active: true }).sort({ sortOrder: 1, createdAt: -1 }).populate('productIds');
    res.json({ success: true, data: combos });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: 'Failed to fetch combos' });
  }
};

const getComboDetails = async (req, res) => {
  try {
    const { idOrSlug } = req.params;
    let combo = null;
    if (mongoose.Types.ObjectId.isValid(idOrSlug)) {
      combo = await Combo.findById(idOrSlug).populate('productIds');
    }
    if (!combo) {
      combo = await Combo.findOne({ slug: idOrSlug }).populate('productIds');
    }
    if (!combo) {
      return res.status(404).json({ success: false, message: 'Combo not found' });
    }
    res.json({ success: true, data: combo });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: 'Failed to fetch combo' });
  }
};

module.exports = { listActiveCombos, getComboDetails };
