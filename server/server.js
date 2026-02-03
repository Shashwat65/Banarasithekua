const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");
require("dotenv").config();
const authRouter = require("./routes/auth/auth-routes");
const adminProductsRouter = require("./routes/admin/products-routes");
const adminOrderRouter = require("./routes/admin/order-routes");
const adminCategoryRouter = require("./routes/admin/category-routes");
const adminUserRouter = require("./routes/admin/user-routes");
const adminComboRouter = require("./routes/admin/combo-routes");
const adminTeamRouter = require("./routes/admin/team-routes");
const adminSliderRouter = require("./routes/admin/slider-routes");

const shopProductsRouter = require("./routes/shop/products-routes");
const shopCartRouter = require("./routes/shop/cart-routes");
const shopAddressRouter = require("./routes/shop/address-routes");
const shopOrderRouter = require("./routes/shop/order-routes");
const shopSearchRouter = require("./routes/shop/search-routes");
const shopReviewRouter = require("./routes/shop/review-routes");
const phonepeStdRouter = require('./routes/shop/phonepe-standard-routes');
const shopCombosRouter = require('./routes/shop/combos-routes');

const commonFeatureRouter = require("./routes/common/feature-routes");
const commonTeamRouter = require("./routes/common/team-routes");
const commonSliderRouter = require("./routes/common/slider-routes");

//create a database connection -> u can also
//create a separate file for this and then import/use that file here

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/banarasithekua";

mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((error) => console.log(error));

const app = express();
const PORT = process.env.PORT || 5000;

// Robust CORS configuration: allow the configured FRONTEND_URL and common dev origins
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
].filter(Boolean);

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (e.g., mobile apps, curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      // In development we will echo back the origin if it's localhost-ish
      if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
        return callback(null, true);
      }
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ["GET", "POST", "DELETE", "PUT", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "Cache-Control",
    "Expires",
    "Pragma",
    "X-Requested-With",
    "X-VERIFY",
  ],
  exposedHeaders: ["Content-Length", "X-Requested-With"],
  credentials: true,
  optionsSuccessStatus: 200,
};

// Enable preflight for all routes
app.options('*', cors(corsOptions));
app.use(cors(corsOptions));

app.use(cookieParser());
app.use(express.json());

// Ensure CORS-related headers are present on every response (helpful for strict dev setups)
app.use((req, res, next) => {
  const origin = req.headers.origin || req.headers.host;
  if (origin) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, X-VERIFY');
  res.header('Access-Control-Expose-Headers', 'Content-Length, X-Requested-With');
  next();
});

// Serve static files from the React app (client build) - BEFORE API routes
// This ensures static assets (JS, CSS, images) are served properly
const staticPath = path.join(__dirname, "../client/dist");
app.use(express.static(staticPath, {
  index: false, // Don't serve index.html for directory requests yet
  maxAge: '1d',
  setHeaders: (res, path) => {
    // Cache static assets aggressively
    if (path.endsWith('.js') || path.endsWith('.css') || path.endsWith('.woff') || path.endsWith('.woff2')) {
      res.setHeader('Cache-Control', 'public, max-age=31536000');
    }
  }
}));

// API Routes - these take priority over the SPA fallback
app.use("/api/auth", authRouter);
app.use("/api/admin/products", adminProductsRouter);
app.use("/api/admin/orders", adminOrderRouter);
app.use("/api/admin/categories", adminCategoryRouter);
app.use("/api/admin/users", adminUserRouter);
app.use("/api/admin/combos", adminComboRouter);
app.use("/api/admin/team", adminTeamRouter);
app.use("/api/admin/sliders", adminSliderRouter);

app.use("/api/shop/products", shopProductsRouter);
app.use("/api/shop/cart", shopCartRouter);
app.use("/api/shop/address", shopAddressRouter);
app.use("/api/shop/order", shopOrderRouter);
app.use("/api/shop/search", shopSearchRouter);
app.use("/api/shop/review", shopReviewRouter);
app.use('/api/shop/payment/phonepe', phonepeStdRouter);
app.use('/api/shop/combos', shopCombosRouter);

app.use("/api/common/feature", commonFeatureRouter);
app.use("/api/common/team", commonTeamRouter);
app.use("/api/common/slider", commonSliderRouter);

// SPA Fallback - Must be LAST
// This catches all non-API, non-static-file requests and serves index.html
// Allowing React Router to handle the routing
app.get("*", (req, res) => {
  // Don't serve SPA for API routes that somehow got here
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ message: 'API endpoint not found' });
  }
  
  res.sendFile(path.join(staticPath, "index.html"), (err) => {
    if (err) {
      console.error('Error serving index.html:', err);
      res.status(500).send('Error loading application');
    }
  });
});

app.listen(PORT, () => console.log(`Server is now running on port ${PORT}`));
