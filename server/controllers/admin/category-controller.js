const Category = require("../../models/Category");
const { generateUniqueSlug, slugify } = require("../../utils/slug");

// Create
const createCategory = async (req, res) => {
  try {
    const { name, slug } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: "Name is required" });
    }
    const rawSlug = slug || slugify(name);
    const uniqueSlug = await generateUniqueSlug(Category, rawSlug);
    const category = await Category.create({ name, slug: uniqueSlug });
    res.status(201).json({ success: true, data: category });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: "Failed to create category" });
  }
};

// List
const listCategories = async (_req, res) => {
  try {
    const categories = await Category.find({}).sort({ createdAt: -1 });
    res.json({ success: true, data: categories });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: "Failed to fetch categories" });
  }
};

// Update
const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, slug } = req.body;
    const category = await Category.findById(id);
    if (!category) return res.status(404).json({ success: false, message: "Category not found" });
    if (name) category.name = name;
    if (slug || name) {
      const baseSlug = slug || name || category.slug;
      category.slug = await generateUniqueSlug(Category, baseSlug, category._id);
    }
    await category.save();
    res.json({ success: true, data: category });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: "Failed to update category" });
  }
};

// Delete
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findByIdAndDelete(id);
    if (!category) return res.status(404).json({ success: false, message: "Category not found" });
    res.json({ success: true, message: "Category deleted" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: "Failed to delete category" });
  }
};

module.exports = { createCategory, listCategories, updateCategory, deleteCategory };
