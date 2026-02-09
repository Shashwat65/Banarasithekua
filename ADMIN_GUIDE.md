# 🛍️ Dynamic eCommerce Platform - Admin Guide

## 🎯 Overview

Your static website has been transformed into a **fully dynamic eCommerce platform** with:

- ✅ Database-driven content (MongoDB)
- ✅ Complete Admin Panel
- ✅ Media Management System
- ✅ Product & Category Management
- ✅ Order Management System
- ✅ Video Reviews Section
- ✅ Banner Management
- ✅ Team Management
- ✅ User Authentication & Cart

---

## 🚀 Quick Start

### 1. Install Dependencies

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 2. Configure Environment

Create `server/.env`:

```env
MONGODB_URI=mongodb://localhost:27017/banarasithekua
PORT=5000
FRONTEND_URL=http://localhost:5173
JWT_SECRET=your-secret-key-here
```

### 3. Start the Application

```bash
# Terminal 1: Start backend
cd server
npm run dev

# Terminal 2: Start frontend
cd client
npm run dev
```

### 4. Access Admin Panel

1. Register a new account at `http://localhost:5173/signup`
2. Update the user role to `admin` in MongoDB:
   ```javascript
   db.users.updateOne(
     { email: "your@email.com" },
     { $set: { role: "admin" } }
   )
   ```
3. Login and access `/admin`

---

## 📚 Admin Panel Features

### 🏠 Dashboard
- Total sales overview
- Order statistics
- Product count
- 6-month sales trends

### 📦 Product Management

**Add/Edit Products with:**
- Product Name (auto-generates slug)
- Price & Original Price (for discounts)
- Stock Quantity
- Category (dropdown from categories)
- Weight
- Pack Size
- Description
- **Highlights** (one per line)
- **Multiple Images** (up to 8)

**Example Highlights:**
```
100% Pure and Natural
Made from Fresh Ingredients
No Artificial Preservatives
Rich in Nutrients
Traditional Recipe
```

### 🗂️ Category Management

- Create categories
- Auto-generate slugs
- Edit category names
- Delete categories
- Assign products to categories

### 📋 Order Management

**View & Manage:**
- Order ID & Customer Details
- Phone, Email, Address
- Products ordered with quantities
- Total Amount
- Payment Status
- **Order Status Updates:**
  - Pending
  - Confirmed
  - Processing
  - Shipped
  - Out for Delivery
  - Delivered
  - Cancelled

### 👥 Team Management

Add team members with:
- Name
- Role/Position
- Profile Photo Upload
- Display Order
- Active/Inactive status

### 🎬 Video Reviews

**Manage short-form video content:**

**YouTube Videos:**
- Paste YouTube URL (regular or Shorts)
- Auto-extracts video ID
- Title & Description
- Display order

**Uploaded Videos:**
- Upload video files (max 100MB)
- Stored locally in `/uploads/videos`
- Title & Description
- Active/Inactive status

### 🏷️ Banner Management

**Create banners for:**
- Header
- Main section
- Sidebar
- Footer

**Banner Features:**
- Upload banner image
- Optional link URL
- Title
- Position selection
- Sort order

### 🎠 Slider Management

- Upload homepage slider images
- Displayed in hero carousel
- Easy add/remove functionality

---

## 💾 Media Management

### Storage Structure

```
server/uploads/
├── products/     # Product images
├── slider/       # Hero slider images
├── team/         # Team member photos
├── videos/       # Uploaded video reviews
└── banners/      # Banner images
```

### Upload Endpoints

All media uploads are authenticated (admin only):

- **Products:** `POST /api/admin/upload/product`
- **Slider:** `POST /api/admin/upload/slider`
- **Team:** `POST /api/admin/upload/team`
- **Videos:** `POST /api/admin/upload/video`
- **Banners:** `POST /api/admin/upload/banner`

---

## 🔐 Security Features

### Admin Authentication
- JWT-based authentication
- Cookie-based session storage
- Role-based access control (admin only)
- Automatic redirects for unauthorized access

### Middleware Protection
All admin routes are protected:
```javascript
router.use(authMiddleware, (req, res, next) => {
  if (req.user?.role !== 'admin') 
    return res.status(403).json({ message: 'Admins only' });
  next();
});
```

---

## 🛒 User Features

### Customer Capabilities
- Register & Login
- Browse products by category
- Add to cart & update quantities
- Checkout with PhonePe payment
- View order history
- Track orders

### Cart System
- Persistent cart (database-backed)
- Real-time price calculation
- Stock validation
- Session management

---

## 📊 Database Schema

### Product Schema
```javascript
{
  name: String,
  slug: String (indexed),
  description: String,
  category: ObjectId (ref: Category),
  price: Number,
  originalPrice: Number,
  stock: Number,
  weight: String,
  packSize: String,
  highlights: [String],
  images: [{ url: String, public_id: String }],
  timestamps: true
}
```

### Order Schema
```javascript
{
  userId: String,
  userName: String,
  userEmail: String,
  userPhone: String,
  cartItems: [{
    productId: String,
    title: String,
    image: String,
    price: String,
    quantity: Number
  }],
  addressInfo: Object,
  orderStatus: String,
  paymentStatus: String,
  totalAmount: Number,
  orderDate: Date,
  timestamps: true
}
```

### VideoReview Schema
```javascript
{
  title: String (required),
  description: String,
  videoType: 'upload' | 'youtube',
  videoUrl: String (required),
  thumbnailUrl: String,
  youtubeId: String,
  active: Boolean,
  sortOrder: Number,
  views: Number,
  timestamps: true
}
```

### Banner Schema
```javascript
{
  title: String,
  imageUrl: String (required),
  link: String,
  position: 'header' | 'main' | 'sidebar' | 'footer',
  active: Boolean,
  sortOrder: Number,
  timestamps: true
}
```

---

## 🔄 Fallback System

### Empty Database Handling

**If database is empty, the system:**
1. Shows hardcoded demo products (from `sampleProducts.ts`)
2. Displays default slider images
3. Hides empty sections gracefully
4. Provides clear admin prompts

### Default Behavior
- Homepage shows sample content
- Categories section hidden if no categories
- Team section hidden if no team members
- Video reviews hidden if no videos

---

## 🌐 API Endpoints

### Public Endpoints
```
GET  /api/shop/products/get
GET  /api/shop/products/get/:idOrSlug
GET  /api/common/slider/get
GET  /api/common/team/get
GET  /api/common/videos
GET  /api/common/banners
POST /api/auth/register
POST /api/auth/login
```

### Admin Endpoints (Protected)
```
# Products
GET    /api/admin/products/get
POST   /api/admin/products/add
PUT    /api/admin/products/edit/:id
DELETE /api/admin/products/delete/:id

# Categories
GET    /api/admin/categories/get
POST   /api/admin/categories/add
PUT    /api/admin/categories/edit/:id
DELETE /api/admin/categories/delete/:id

# Orders
GET    /api/admin/orders/get
PUT    /api/admin/orders/update/:id

# Videos
GET    /api/admin/videos
POST   /api/admin/videos
PUT    /api/admin/videos/:id
DELETE /api/admin/videos/:id

# Banners
GET    /api/admin/banners
POST   /api/admin/banners
PUT    /api/admin/banners/:id
DELETE /api/admin/banners/:id

# Uploads
POST   /api/admin/upload/product
POST   /api/admin/upload/slider
POST   /api/admin/upload/team
POST   /api/admin/upload/video
POST   /api/admin/upload/banner
```

---

## 🐛 Troubleshooting

### Products not showing?
1. Check MongoDB connection
2. Verify admin panel shows products
3. Check browser console for errors
4. Ensure products have `stock > 0`

### Can't access admin panel?
1. Verify user role is `admin` in database
2. Clear cookies and login again
3. Check JWT_SECRET in .env

### Images not uploading?
1. Check `server/uploads/` folder exists
2. Verify folder permissions (write access)
3. Check file size limits
4. Review server logs for errors

### Orders not appearing?
1. Verify PhonePe configuration
2. Check payment status in database
3. Review payment gateway logs

---

## 📈 Future Enhancements

### Planned Features
- [ ] Product search & filters
- [ ] Product reviews & ratings
- [ ] Inventory alerts
- [ ] Email notifications
- [ ] Analytics dashboard
- [ ] Bulk product import
- [ ] Discount coupons
- [ ] Multiple payment gateways

---

## 🛡️ Best Practices

### Product Management
- Use high-quality images (recommended: 800x800px)
- Write clear, concise descriptions
- Keep highlights short and impactful
- Set realistic stock quantities
- Update prices regularly

### Media Files
- Optimize images before upload (compress)
- Use descriptive filenames
- Maintain consistent image dimensions
- Regular backup of uploads folder

### Order Processing
- Update order status promptly
- Communicate with customers
- Maintain accurate stock levels
- Monitor payment confirmations

---

## 📞 Support

For issues or questions:
1. Check MongoDB logs: `server/logs/`
2. Review browser console
3. Check server terminal output
4. Verify environment variables

---

**🎉 Your eCommerce platform is now fully dynamic and ready for production!**
