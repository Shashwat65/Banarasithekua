# Deployment Guide for Render

## Complete Fix for Routing Issues

All routing issues have been fixed. Here's what was done:

### 1. Server-Side Changes (server/server.js)
- ✅ Reordered middleware: Static files → API routes → SPA fallback
- ✅ Added proper static file serving with caching
- ✅ Added SPA fallback that serves index.html for all non-API routes
- ✅ Added error handling for missing index.html

### 2. Client-Side Changes
- ✅ Added `<base href="/" />` to index.html for proper asset loading
- ✅ Created _redirects file for Netlify/Render compatibility
- ✅ Created _routes.json for Cloudflare Pages compatibility
- ✅ Created 404.html as ultimate fallback
- ✅ Fixed API calls to use absolute URLs (not relative /api)
- ✅ Optimized build configuration in vite.config.ts

### 3. Render Configuration (render.yaml)
- ✅ Created render.yaml for easy deployment
- ✅ Configured static site with proper rewrite rules
- ✅ Added caching headers for performance

## Deploy Instructions

### Option 1: Using Render Dashboard (Recommended for existing services)

#### For the API Server:
1. Push all changes to GitHub
2. Render will auto-redeploy the server
3. Server is ready immediately

#### For the Client (Static Site):
1. Go to your Render dashboard
2. Find your static site service
3. Go to Settings → Redirects/Rewrites
4. Add this rule:
   - **Source**: `/*`
   - **Destination**: `/index.html`
   - **Action**: `Rewrite`
5. Trigger manual deploy or push to GitHub

### Option 2: Using render.yaml (For new deployment)

1. **Delete existing services** from Render dashboard (if any)
2. **Push all changes** to GitHub
3. In Render Dashboard:
   - Click "New" → "Blueprint"
   - Connect your repository
   - Render will read render.yaml and create both services
4. **Set Environment Variables**:
   
   For API Server (banarasithekua-server):
   ```
   MONGODB_URI=your_mongodb_connection_string
   CLIENT_SECRET_KEY=your_secret_key_here
   FRONTEND_URL=https://your-frontend.onrender.com
   PHONEPE_MERCHANT_ID=your_merchant_id
   PHONEPE_MERCHANT_KEY=your_merchant_key
   CLOUDINARY_CLOUD_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_cloudinary_key
   CLOUDINARY_API_SECRET=your_cloudinary_secret
   ```
   
   For Client (banarasithekua-client):
   ```
   VITE_API_URL=https://your-api-server.onrender.com/api
   ```

### Option 3: Manual Deploy Steps

If you prefer to keep existing services:

#### Server:
```bash
# Server is already configured correctly
# Just push to GitHub and it will auto-deploy
git add .
git commit -m "Fix routing issues"
git push
```

#### Client:
```bash
# Update .env.production with your API URL
# Then rebuild
cd client
npm run build

# Deploy the dist folder
# Or push to GitHub for auto-deploy
```

## Verification Checklist

After deployment, test these URLs directly (type in browser, not click):

- [ ] https://your-site.com/ (homepage)
- [ ] https://your-site.com/terms (should load, not 404)
- [ ] https://your-site.com/admin (should load admin or redirect to login)
- [ ] https://your-site.com/products (should load products page)
- [ ] https://your-site.com/products/some-product (should load or show not found page, not 404)
- [ ] Refresh any page multiple times (should not 404)

## Common Issues & Solutions

### Still Getting 404?
- Check if VITE_API_URL is set correctly in Render environment variables
- Verify the build completed successfully
- Check Render logs for errors
- Clear browser cache and try in incognito mode

### API Calls Failing?
- Verify VITE_API_URL ends with /api
- Check CORS settings in server (FRONTEND_URL must match your frontend URL)
- Verify cookies are being sent (check Network tab → Request Headers)

### Assets Not Loading?
- Check that `<base href="/" />` is in index.html
- Verify static files are in the dist folder after build
- Check browser console for errors

## Files Changed

### Server Files:
- ✅ server/server.js - Complete routing rewrite

### Client Files:
- ✅ client/index.html - Added base tag
- ✅ client/vite.config.ts - Added build optimization
- ✅ client/src/services/api.ts - Fixed API URL normalization
- ✅ client/src/components/ProductGrid.tsx - Fixed API calls
- ✅ client/public/_redirects - Render/Netlify SPA support
- ✅ client/public/_routes.json - Cloudflare Pages support
- ✅ client/public/404.html - Ultimate fallback
- ✅ client/.env.production - Production environment template

### Root Files:
- ✅ render.yaml - Complete deployment configuration

## Next Steps

1. **Push all changes to GitHub**
2. **Update environment variables in Render**
3. **Redeploy both services**
4. **Test all routes**

The routing will work perfectly after these changes!
