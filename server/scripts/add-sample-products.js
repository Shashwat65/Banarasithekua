const mongoose = require('mongoose');
const Product = require('./models/Product');
require('dotenv').config();

const sampleProducts = [
  {
    title: "Classic Banarasi Thekua",
    description: "Traditional handmade Thekua prepared with authentic Banarasi recipe. Made with wheat flour, jaggery, and ghee, these golden-brown delights are perfect for festivals and daily snacking.",
    category: "traditional",
    brand: "banarasi-thekua",
    price: 299,
    salePrice: 249,
    totalStock: 50,
    image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=500&h=500&fit=crop"
  },
  {
    title: "Premium Gift Box - 1kg",
    description: "Beautifully packaged premium Thekua gift box containing assorted traditional sweets. Perfect for gifting during festivals, weddings, and special occasions.",
    category: "gift-boxes",
    brand: "banarasi-thekua",
    price: 899,
    salePrice: 799,
    totalStock: 25,
    image: "https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=500&h=500&fit=crop"
  },
  {
    title: "Coconut Thekua Special",
    description: "Innovative fusion of traditional Thekua with fresh coconut flakes. A modern twist on the classic recipe that maintains the authentic taste while adding tropical flavor.",
    category: "premium",
    brand: "banarasi-thekua",
    price: 399,
    salePrice: 349,
    totalStock: 30,
    image: "https://images.unsplash.com/photo-1587049633312-d628ae50a8ae?w=500&h=500&fit=crop"
  },
  {
    title: "Festive Diwali Pack",
    description: "Special festive collection featuring traditional Thekua varieties. Includes classic, dry fruit, and coconut variants in an elegant Diwali-themed packaging.",
    category: "festive",
    brand: "banarasi-thekua",
    price: 599,
    salePrice: 499,
    totalStock: 40,
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=500&fit=crop"
  },
  {
    title: "Dry Fruit Thekua Premium",
    description: "Enriched with almonds, cashews, and raisins, this premium variant offers a rich and nutritious experience. Made with pure ghee and organic jaggery.",
    category: "premium",
    brand: "banarasi-thekua",
    price: 549,
    salePrice: 479,
    totalStock: 35,
    image: "https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=500&h=500&fit=crop"
  },
  {
    title: "Mini Thekua Bites - 250g",
    description: "Perfect bite-sized Thekua pieces ideal for office snacking and sharing. Same authentic taste in a convenient mini format.",
    category: "traditional",
    brand: "banarasi-thekua",
    price: 149,
    salePrice: 129,
    totalStock: 60,
    image: "https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=500&h=500&fit=crop"
  },
  {
    title: "Family Pack - 2kg",
    description: "Large family pack perfect for celebrations and large gatherings. Contains our signature classic Thekua in bulk quantity with extended freshness.",
    category: "bulk-orders",
    brand: "banarasi-thekua",
    price: 1199,
    salePrice: 999,
    totalStock: 20,
    image: "https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?w=500&h=500&fit=crop"
  },
  {
    title: "Jaggery Special Thekua",
    description: "Made exclusively with organic jaggery from Maharashtra sugarcane. Rich in minerals and natural sweetness, perfect for health-conscious consumers.",
    category: "premium",
    brand: "banarasi-thekua",
    price: 329,
    salePrice: 289,
    totalStock: 45,
    image: "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=500&h=500&fit=crop"
  },
  {
    title: "Corporate Gift Hamper",
    description: "Professional packaging with assorted Thekua varieties perfect for corporate gifting. Includes branded packaging and custom message card option.",
    category: "gift-boxes",
    brand: "banarasi-thekua",
    price: 1299,
    salePrice: 1099,
    totalStock: 15,
    image: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=500&h=500&fit=crop"
  },
  {
    title: "Wedding Special Collection",
    description: "Elegant wedding favor boxes containing premium Thekua varieties. Perfect for sharing joy with guests and family members during wedding celebrations.",
    category: "festive",
    brand: "banarasi-thekua",
    price: 799,
    salePrice: 699,
    totalStock: 30,
    image: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=500&h=500&fit=crop"
  }
];

async function addSampleProducts() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products');

    // Add sample products
    const products = await Product.insertMany(sampleProducts);
    console.log(`Added ${products.length} sample products`);

    console.log('Sample products added successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error adding sample products:', error);
    process.exit(1);
  }
}

addSampleProducts();