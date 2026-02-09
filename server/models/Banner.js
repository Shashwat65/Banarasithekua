const mongoose = require('mongoose');

const BannerSchema = new mongoose.Schema({
  title: String,
  imageUrl: { type: String, required: true },
  public_id: String,
  link: String,
  position: { 
    type: String, 
    enum: ['header', 'main', 'sidebar', 'footer'], 
    default: 'main' 
  },
  active: { type: Boolean, default: true },
  sortOrder: { type: Number, default: 0 },
  width: Number,
  height: Number,
}, { timestamps: true });

module.exports = mongoose.model('Banner', BannerSchema);
