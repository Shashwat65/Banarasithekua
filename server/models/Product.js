const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    // Legacy fields
    image: String,
    title: String,
    salePrice: Number,
    totalStock: Number,
    averageReview: Number,
    // New preferred fields used by admin UI
    name: { type: String },
    slug: { type: String, index: true, unique: false }, // allow duplicates for now to avoid migration complexity
    description: String,
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    brand: String,
    price: Number,
    originalPrice: Number,
    stock: Number,
    weight: String,
    packSize: String,
    attributes: { type: Object },
    // images array for future expansion
    images: [
      {
        url: String,
        public_id: String,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);
