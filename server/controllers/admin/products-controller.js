const { imageUploadUtil } = require("../../helpers/cloudinary");
const Product = require("../../models/Product");
const { authMiddleware } = require("../auth/auth-controller");

const handleImageUpload = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }
    const b64 = Buffer.from(req.file.buffer).toString("base64");
    const url = "data:" + req.file.mimetype + ";base64," + b64;
    const result = await imageUploadUtil(url);

    res.json({ success: true, data: {
      url: result.secure_url || result.url,
      public_id: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
    }});
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error occured while uploading",
    });
  }
};

//add a new product
const addProduct = async (req, res) => {
  try {
    const body = req.body;
    // Accept both legacy and new naming
    const product = new Product({
      name: body.name || body.title,
      title: body.title || body.name, // keep legacy field populated
      slug: body.slug,
      description: body.description,
      price: body.price,
      originalPrice: body.originalPrice || body.salePrice,
      salePrice: body.salePrice || body.originalPrice,
      stock: body.stock || body.totalStock,
      totalStock: body.totalStock || body.stock,
      category: body.category || body.categoryId || null,
      brand: body.brand,
      weight: body.weight,
      packSize: body.packSize,
      image: body.image,
      images: Array.isArray(body.images) ? body.images.slice(0, 8) : [],
    });
    await product.save();
    res.status(201).json({ success: true, data: product });
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, message: 'Error occured' });
  }
};

//fetch all products

const fetchAllProducts = async (req, res) => {
  try {
    const list = await Product.find({}).populate('category');
    res.json({ success: true, data: list });
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, message: 'Error occured' });
  }
};

//edit a product
const editProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body;
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    const assign = (field, value) => {
      if (typeof value !== 'undefined') product[field] = value;
    };

    assign('name', body.name);
    assign('title', body.title || body.name);
    assign('slug', body.slug);
    assign('description', body.description);
    assign('price', body.price);
    assign('originalPrice', body.originalPrice);
    assign('salePrice', body.salePrice);
    assign('stock', body.stock);
    assign('totalStock', body.totalStock);
    assign('category', body.category || body.categoryId);
    assign('brand', body.brand);
    assign('weight', body.weight);
    assign('packSize', body.packSize);
    assign('image', body.image);
    if (Array.isArray(body.images)) product.images = body.images.slice(0, 8);

    await product.save();
    res.json({ success: true, data: product });
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, message: 'Error occured' });
  }
};

//delete a product
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);

    if (!product)
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });

    res.status(200).json({
      success: true,
      message: "Product delete successfully",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error occured",
    });
  }
};

module.exports = {
  handleImageUpload,
  addProduct,
  fetchAllProducts,
  editProduct,
  deleteProduct,
};
