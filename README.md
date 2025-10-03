# Banarasi Thekua - E-commerce Platform

A modern, full-stack e-commerce platform for Banarasi Thekua, featuring PhonePe payment integration, admin panel, and responsive design.

## 🌟 Features

- **Modern UI/UX**: Clean, responsive design inspired by premium food brands
- **PhonePe Integration**: Secure payment processing with PhonePe Standard Checkout API
- **Admin Panel**: Complete product and order management system
- **User Authentication**: JWT-based secure authentication
- **Shopping Cart**: Real-time cart management with Redux
- **Order Management**: Complete order tracking and status updates
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Image Management**: Cloudinary integration for product images

## 🚀 Tech Stack

### Frontend
- **React 18** with Vite
- **Tailwind CSS** for styling
- **Redux Toolkit** for state management
- **React Router** for navigation
- **Axios** for API calls
- **Lucide React** for icons

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose
- **JWT** for authentication
- **Cloudinary** for image storage
- **PhonePe API** for payments
- **Bcrypt** for password hashing

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **MongoDB** (local or MongoDB Atlas)
- **Git**

## 🛠️ Local Development Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Shashwat65/Banarasithekua.git
cd Banarasithekua
```

### 2. Server Setup

Navigate to the server directory:
```bash
cd server
```

Install dependencies:
```bash
npm install
```

Create a `.env` file in the server directory:
```env
# Backend Environment Variables
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=your_mongodb_connection_string

# JWT Secret
JWT_SECRET=your_super_secure_jwt_secret_key

# Email Configuration (Optional - for notifications)
SMTP_HOST=your_smtp_host
SMTP_PORT=587
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_password
SMTP_FROM=your_email_address

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# PhonePe Payment Gateway
PHONEPE_MERCHANT_ID=your_phonepe_merchant_id
PHONEPE_SALT_KEY=your_phonepe_salt_key
PHONEPE_SALT_INDEX=1
PHONEPE_ENV=sandbox
PHONEPE_CALLBACK_URL=http://localhost:5173/shop/payment-callback

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173

# Admin Configuration
ADMIN_EMAIL=your_admin_email
ADMIN_SECRET=your_admin_password
```

Start the server:
```bash
npm run dev
```

The server will run on `http://localhost:5000`

### 3. Client Setup

Open a new terminal and navigate to the client directory:
```bash
cd client
```

Install dependencies:
```bash
npm install
```

Create a `.env` file in the client directory:
```env
# Frontend Environment Variables
VITE_API_BASE_URL=http://localhost:5000
VITE_APP_NAME=Banarasi Thekua
VITE_APP_DESCRIPTION=Premium Traditional Sweets from Varanasi
```

Start the client:
```bash
npm run dev
```

The client will run on `http://localhost:5173`

### 4. Add Sample Products (Optional)

To populate the database with sample products:
```bash
cd server
node scripts/add-sample-products.js
```

## 🌐 Production Deployment on Render

### 1. Prepare for Deployment

#### Server Deployment:

1. **Create a new Web Service on Render**
2. **Connect your GitHub repository**
3. **Configure build settings:**
   - **Build Command:** `cd server && npm install`
   - **Start Command:** `cd server && npm start`
   - **Root Directory:** Leave blank (auto-detect)

4. **Set Environment Variables on Render:**
   ```env
   NODE_ENV=production
   PORT=10000
   MONGODB_URI=your_production_mongodb_uri
   JWT_SECRET=your_production_jwt_secret
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   PHONEPE_MERCHANT_ID=your_phonepe_merchant_id
   PHONEPE_SALT_KEY=your_phonepe_salt_key
   PHONEPE_SALT_INDEX=1
   PHONEPE_ENV=production
   PHONEPE_CALLBACK_URL=https://your-frontend-url.com/shop/payment-callback
   FRONTEND_URL=https://your-frontend-url.com
   ADMIN_EMAIL=your_admin_email
   ADMIN_SECRET=your_admin_password
   ```

#### Client Deployment:

1. **Create another Web Service on Render**
2. **Connect the same GitHub repository**
3. **Configure build settings:**
   - **Build Command:** `cd client && npm install && npm run build`
   - **Start Command:** `cd client && npm run preview`
   - **Root Directory:** Leave blank

4. **Set Environment Variables on Render:**
   ```env
   VITE_API_BASE_URL=https://your-backend-url.onrender.com
   VITE_APP_NAME=Banarasi Thekua
   VITE_APP_DESCRIPTION=Premium Traditional Sweets from Varanasi
   ```

### 2. Alternative: Single Service Deployment

You can also deploy as a single service by creating a build script that serves both frontend and backend:

1. **Create `package.json` in the root directory:**
```json
{
  "name": "banarasi-thekua-full-stack",
  "version": "1.0.0",
  "scripts": {
    "build": "cd client && npm install && npm run build",
    "start": "cd server && npm install && npm start",
    "dev:server": "cd server && npm run dev",
    "dev:client": "cd client && npm run dev"
  }
}
```

2. **Update server to serve static files (add to `server.js`):**
```javascript
const path = require('path');

// Serve static files from React build
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/dist', 'index.html'));
  });
}
```

## 🔧 Configuration Details

### PhonePe Integration Setup

1. **Register with PhonePe** for merchant account
2. **Get credentials:**
   - Merchant ID
   - Salt Key
   - Salt Index
3. **Configure webhook URLs** in PhonePe dashboard
4. **Test in sandbox** before going live

### Cloudinary Setup

1. **Create Cloudinary account**
2. **Get API credentials** from dashboard
3. **Configure upload presets** for image optimization

### MongoDB Setup

For production, use **MongoDB Atlas**:
1. **Create cluster** on MongoDB Atlas
2. **Configure network access** (allow all IPs for Render)
3. **Create database user**
4. **Get connection string**

## 📱 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/check-auth` - Check authentication status

### Products
- `GET /api/shop/products/get` - Get all products
- `GET /api/shop/products/get/:id` - Get single product
- `POST /api/admin/products/add` - Add product (Admin)
- `PUT /api/admin/products/edit/:id` - Edit product (Admin)
- `DELETE /api/admin/products/delete/:id` - Delete product (Admin)

### Cart
- `POST /api/shop/cart/add` - Add to cart
- `GET /api/shop/cart/get/:userId` - Get user cart
- `PUT /api/shop/cart/update-cart` - Update cart item
- `DELETE /api/shop/cart/:userId/:productId` - Remove from cart

### Orders
- `POST /api/shop/order/create` - Create order
- `POST /api/shop/order/capture` - Capture payment
- `GET /api/shop/order/list/:userId` - Get user orders
- `GET /api/shop/order/details/:id` - Get order details
- `GET /api/shop/order/payment-status/:id` - Check payment status

## 🔒 Security Features

- **JWT Authentication** with secure HTTP-only cookies
- **Password Hashing** with bcrypt
- **CORS Protection** with configurable origins
- **Input Validation** and sanitization
- **Environment Variables** for sensitive data
- **Secure Payment Processing** with PhonePe

## 🐛 Troubleshooting

### Common Issues:

1. **White Screen on Frontend:**
   - Check if `VITE_API_BASE_URL` is correctly set
   - Ensure backend is running and accessible

2. **Payment Errors:**
   - Verify PhonePe credentials
   - Check callback URL configuration
   - Ensure HTTPS in production

3. **CORS Errors:**
   - Check `FRONTEND_URL` in server environment
   - Verify CORS configuration in `server.js`

4. **Database Connection:**
   - Check MongoDB URI format
   - Ensure network access is configured (Atlas)
   - Verify database credentials

### Environment Variable Checklist:

**Server (.env):**
- ✅ MONGODB_URI
- ✅ JWT_SECRET
- ✅ CLOUDINARY credentials
- ✅ PHONEPE credentials
- ✅ FRONTEND_URL

**Client (.env):**
- ✅ VITE_API_BASE_URL

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support, email support@banarasithekua.com or create an issue in the GitHub repository.

---

**Built with ❤️ for preserving the authentic taste of Banarasi Thekua**