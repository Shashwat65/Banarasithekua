const Product = require("../../models/Product");
const { generateUniqueSlug, slugify } = require("../../utils/slug");

const handleImageUpload = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const fileUrl = `${baseUrl}/uploads/${req.file.filename}`;

    res.json({
      success: true,
      data: {
        url: fileUrl,
        public_id: req.file.filename,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Error occured while uploading" });
  }
};

const normalizeImages = (body) => {
  if (Array.isArray(body.images)) return body.images.slice(0, 8);
  return [];
};

// Create product
const addProduct = async (req, res) => {
  try {
    const body = req.body || {};
    const name = body.name || body.title;
    if (!name) {
      return res.status(400).json({ success: false, message: "Name is required" });
    }
    const rawSlug = body.slug || slugify(name);
    const slug = await generateUniqueSlug(Product, rawSlug);

    const images = normalizeImages(body);
    const image = body.image || images[0]?.url;

    const product = await Product.create({
      name,
      title: body.title || name,
      slug,
      description: body.description,
      price: body.price,
      originalPrice: body.originalPrice || body.salePrice,
      salePrice: body.salePrice || body.originalPrice,
      stock: body.stock ?? body.totalStock,
      totalStock: body.totalStock ?? body.stock,
      category: body.category || body.categoryId || null,
      brand: body.brand,
      weight: body.weight,
      packSize: body.packSize,
      image,
      images,
      attributes: body.attributes && typeof body.attributes === "object" ? body.attributes : undefined,
    });

    res.status(201).json({ success: true, data: product });
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, message: "Error occured" });
  }
};

// List all products
const fetchAllProducts = async (_req, res) => {
  try {
    const list = await Product.find({}).populate("category").sort({ createdAt: -1 });
    res.json({ success: true, data: list });
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, message: "Error occured" });
  }
};

// Update a product
const editProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body || {};
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });

    const assign = (field, value) => {
      if (typeof value !== "undefined") product[field] = value;
    };

    if (body.name || body.title) {
      const nextName = body.name || body.title;
      assign("name", nextName);
      assign("title", body.title || nextName);
    }

    if (body.slug || body.name || body.title) {
      const baseSlug = body.slug || body.name || body.title || product.slug;
      product.slug = await generateUniqueSlug(Product, baseSlug, product._id);
    }

    assign("description", body.description);
    assign("price", body.price);
    assign("originalPrice", body.originalPrice);
    assign("salePrice", body.salePrice);
    assign("stock", body.stock);
    assign("totalStock", body.totalStock);
    assign("category", body.category || body.categoryId);
    assign("brand", body.brand);
    assign("weight", body.weight);
    assign("packSize", body.packSize);
    assign("image", body.image);
    if (Array.isArray(body.images)) product.images = body.images.slice(0, 8);
    if (body.attributes && typeof body.attributes === "object") product.attributes = body.attributes;

    await product.save();
    res.json({ success: true, data: product });
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, message: "Error occured" });
  }
};

// Delete a product
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    res.status(200).json({ success: true, message: "Product delete successfully" });
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, message: "Error occured" });
  }
};

module.exports = { handleImageUpload, addProduct, fetchAllProducts, editProduct, deleteProduct };
