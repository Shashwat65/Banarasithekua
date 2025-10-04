const mongoose = require('mongoose');

const ComboSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true },
  description: String,
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }], // legacy field
  productIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }], // preferred
  price: { type: Number, required: true },
  originalPrice: Number,
  image: String, // representative image
  images: [{ url: String, public_id: String }],
  active: { type: Boolean, default: true },
  sortOrder: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Combo', ComboSchema);
