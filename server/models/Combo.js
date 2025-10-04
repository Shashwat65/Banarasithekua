const mongoose = require('mongoose');

const ComboSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true },
  description: String,
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  price: Number,
  originalPrice: Number,
  image: String, // representative image
  active: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Combo', ComboSchema);
