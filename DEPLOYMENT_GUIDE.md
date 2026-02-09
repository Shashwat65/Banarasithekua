# 🚢 Deployment Guide - Dynamic eCommerce Platform

## 📋 Pre-Deployment Checklist

- [ ] MongoDB database configured
- [ ] Environment variables set
- [ ] Media uploads folder configured
- [ ] Admin user created
- [ ] Products added via admin panel
- [ ] Payment gateway configured (PhonePe)
- [ ] SSL certificate ready (for production)

---

## 🏗️ Production Build

### 1. Build Frontend

```bash
cd client
npm run build
```

This creates `client/dist/` with optimized static files.

### 2. Configure Server

The server automatically serves the built frontend:

```javascript
// server/server.js already configured
app.use(express.static(path.join(__dirname, "../client/dist")));
```

---

## 🌐 Deployment Options

### Option 1: Render.com (Recommended)

#### Backend + Frontend (Single Service)

**render.yaml** (already configured):
```yaml
services:
  - type: web
    name: banarasithekua
    runtime: node
    buildCommand: cd client && npm install && npm run build && cd ../server && npm install
    startCommand: cd server && npm start
    envVars:
      - key: MONGODB_URI
        sync: false
      - key: JWT_SECRET
        generateValue: true
      - key: NODE_ENV
        value: production
```

**Deploy Steps:**
1. Push code to GitHub
2. Connect repository to Render
3. Set environment variables in Render dashboard
4. Deploy

### Option 2: MongoDB Atlas + Render

**Advantages:**
- Free MongoDB hosting (512MB)
- Automatic backups
- Better scalability

**Setup:**
1. Create MongoDB Atlas cluster
2. Get connection string
3. Add to Render environment variables:
   ```
   MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/dbname
   ```

---

## 🔐 Environment Variables (Production)

### Required Variables

```env
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database

# Server
PORT=5000
NODE_ENV=production

# Security
JWT_SECRET=your-very-secure-random-string-here

# Frontend URL (your domain)
FRONTEND_URL=https://yourdomain.com

# Payment Gateway
PHONEPE_MERCHANT_ID=your_merchant_id
PHONEPE_SALT_KEY=your_salt_key
PHONEPE_SALT_INDEX=1
```

### Generate Secure JWT Secret

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

## 📁 File Structure (Production)

```
project/
├── client/
│   └── dist/              # Built frontend (auto-served)
├── server/
│   ├── uploads/           # Media files (persistent)
│   │   ├── products/
│   │   ├── slider/
│   │   ├── team/
│   │   ├── videos/
│   │   └── banners/
│   ├── models/
│   ├── controllers/
│   ├── routes/
│   └── server.js
└── render.yaml
```

---

## 💾 Persistent Storage

### Important: Uploads Folder

Render's web services have **ephemeral storage**. For persistent media:

**Option 1: Use Cloudinary (Recommended)**
```bash
npm install cloudinary
```

Update upload handlers to use Cloudinary instead of local storage.

**Option 2: Render Disk Storage**
Add persistent disk in `render.yaml`:
```yaml
disk:
  name: uploads
  mountPath: /app/server/uploads
  sizeGB: 10
```

---

## 🗄️ Database Migration

### From Local to Production

**1. Export Local Data:**
```bash
mongodump --uri="mongodb://localhost:27017/banarasithekua" --out=./backup
```

**2. Import to Production:**
```bash
mongorestore --uri="mongodb+srv://user:pass@cluster.mongodb.net/dbname" ./backup/banarasithekua
```

### Initial Admin User Setup

```javascript
// Connect to production MongoDB
db.users.findOne({ email: "admin@example.com" })

// Update role to admin
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "admin" } }
)
```

---

## 🚀 Deployment Process

### Step-by-Step Render Deployment

**1. Prepare Repository**
```bash
git add .
git commit -m "Ready for production"
git push origin main
```

**2. Create Render Account**
- Go to https://render.com
- Sign up/Login with GitHub

**3. Create New Web Service**
- Click "New +" → "Web Service"
- Connect your repository
- Select branch: `main`

**4. Configure Service**
- **Name:** banarasithekua
- **Runtime:** Node
- **Build Command:**
  ```bash
  cd client && npm install && npm run build && cd ../server && npm install
  ```
- **Start Command:**
  ```bash
  cd server && npm start
  ```

**5. Add Environment Variables**
Go to "Environment" tab and add:
- `MONGODB_URI`
- `JWT_SECRET`
- `NODE_ENV=production`
- `FRONTEND_URL` (your Render URL)

**6. Deploy**
Click "Create Web Service"

**7. Monitor Build**
Watch the logs for errors

**8. Test Deployment**
- Visit your Render URL
- Login to admin panel
- Test product creation
- Test order flow

---

## 🔍 Post-Deployment Testing

### Critical Tests

✅ **Homepage**
- Slider loads
- Products display
- Banners show
- Videos section works

✅ **Products**
- Product pages load
- Images display correctly
- Add to cart works

✅ **Admin Panel**
- Admin login successful
- Product CRUD operations
- Image uploads work
- Order management functional

✅ **Orders**
- Checkout process
- Payment gateway integration
- Order confirmation

✅ **Mobile Responsive**
- Test on mobile devices
- Touch interactions work

---

## 🐛 Common Deployment Issues

### Build Failures

**Issue:** `Cannot find module`
```bash
# Solution: Clear npm cache
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

**Issue:** Out of memory during build
```yaml
# Add to render.yaml
envVars:
  - key: NODE_OPTIONS
    value: --max-old-space-size=4096
```

### Runtime Errors

**Issue:** Cannot connect to MongoDB
- Verify MONGODB_URI is correct
- Check MongoDB Atlas IP whitelist (allow all: 0.0.0.0/0)

**Issue:** Images not displaying
- Check uploads folder permissions
- Verify base URL in image paths
- Consider using Cloudinary

**Issue:** 404 on routes
- Ensure SPA fallback is configured
- Check route order in server.js

---

## 📊 Monitoring & Maintenance

### Render Dashboard

Monitor:
- **CPU/Memory usage**
- **Response times**
- **Error logs**
- **Request volume**

### Database Monitoring

MongoDB Atlas provides:
- Real-time metrics
- Slow query analysis
- Storage usage
- Connection pooling stats

### Backup Strategy

**Database:**
- MongoDB Atlas: Automatic daily backups
- Manual: Run `mongodump` weekly

**Media Files:**
- Download from Render disk periodically
- Sync to cloud storage (S3, Google Cloud)

---

## 🔒 Security Checklist

- [ ] Use HTTPS (Render provides free SSL)
- [ ] Strong JWT_SECRET
- [ ] MongoDB authentication enabled
- [ ] Rate limiting on API endpoints
- [ ] Input validation on all forms
- [ ] CORS properly configured
- [ ] Admin routes protected
- [ ] Passwords hashed (bcrypt)
- [ ] SQL injection prevention (using Mongoose)
- [ ] XSS protection

---

## 🚀 Performance Optimization

### Backend

**1. Enable Compression**
```javascript
const compression = require('compression');
app.use(compression());
```

**2. Cache Static Assets**
```javascript
app.use(express.static('client/dist', {
  maxAge: '1y',
  etag: false
}));
```

**3. Database Indexing**
```javascript
// In Product model
ProductSchema.index({ slug: 1, category: 1 });
```

### Frontend

**1. Image Optimization**
- Compress images before upload
- Use WebP format
- Lazy loading for images

**2. Code Splitting**
```javascript
// Already configured in Vite
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
```

---

## 📈 Scaling Considerations

### When to Scale

**Indicators:**
- Response time > 2 seconds
- CPU usage > 80%
- Memory usage > 90%
- Database connections maxed out

### Scaling Options

**Horizontal Scaling:**
- Add more Render instances
- Use load balancer

**Database Scaling:**
- Upgrade MongoDB Atlas tier
- Enable read replicas
- Add database indexes

**Media Scaling:**
- Move to CDN (Cloudinary/Cloudflare)
- Use image optimization service

---

## 🔄 CI/CD Pipeline

### Automatic Deployment

Render automatically deploys on git push to main branch.

**Custom Deploy Hook:**
```bash
# In Render dashboard, get deploy hook URL
curl -X POST https://api.render.com/deploy/srv-xxxxx
```

### GitHub Actions (Optional)

``yaml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Render
        run: curl -X POST ${{ secrets.RENDER_DEPLOY_HOOK }}
```

---

## 📞 Support & Troubleshooting

### Logs

**Render Logs:**
```bash
# View in dashboard or use CLI
render logs -n banarasithekua
```

**Application Logs:**
```javascript
// Add logging
const winston = require('winston');
const logger = winston.createLogger({
  transports: [new winston.transports.File({ filename: 'error.log' })]
});
```

### Common Solutions

**500 Server Error:**
- Check server logs
- Verify environment variables
- Test database connection

**Slow Performance:**
- Add database indexes
- Enable caching
- Optimize queries

**High Memory Usage:**
- Check for memory leaks
- Optimize image sizes
- Clear old sessions

---

## ✅ Production Checklist

### Before Go-Live

- [ ] All products added with images
- [ ] Categories configured
- [ ] Team members added
- [ ] Slider images uploaded
- [ ] Video reviews added
- [ ] Test orders completed
- [ ] Payment gateway tested
- [ ] Mobile responsive checked
- [ ] SEO meta tags added
- [ ] Google Analytics integrated
- [ ] Contact information updated
- [ ] Privacy policy & terms published
- [ ] Admin credentials secured
- [ ] Database backed up
- [ ] Domain configured
- [ ] SSL certificate active

---

**🎉 Your eCommerce platform is production-ready!**

For questions: Review logs → Check documentation → Contact support
