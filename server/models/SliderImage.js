const mongoose = require('mongoose');

const SliderImageSchema = new mongoose.Schema({
  url: { type: String, required: true },
  public_id: String,
  width: Number,
  height: Number,
  active: { type: Boolean, default: true },
  sortOrder: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('SliderImage', SliderImageSchema);
