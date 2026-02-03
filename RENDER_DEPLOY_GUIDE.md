# Render Deployment Guide for Banarasi Thekua

## Quick Deploy Steps

### 1. Push Code to GitHub
```bash
git add .
git commit -m "Fix Render deployment configuration"
git push origin master
```

### 2. Configure Environment Variables in Render Dashboard

Go to your Render service dashboard and add these environment variables:

#### Required Variables:
```
MONGODB_URI=your-mongodb-connection-string
JWT_SECRET=your-secret-key-here
FRONTEND_URL=https://banarasithekua.onrender.com
```

#### PhonePe Configuration:
```
PHONEPE_ENV=sandbox
PHONEPE_CLIENT_ID=SU2602031625219102577166
PHONEPE_CLIENT_SECRET=3e6e2e59-37d6-42c6-8705-94299ea2ba26
PHONEPE_CLIENT_VERSION=1
PHONEPE_MERCHANT_ID=M23KDVDWOXTNF
PHONEPE_WEBHOOK_USER=your-webhook-username
PHONEPE_WEBHOOK_PASSWORD=your-webhook-password
PHONEPE_CALLBACK_URL=https://banarasithekua.onrender.com/order-confirmation
```

#### Optional - Cloudinary (for image uploads):
```
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### 3. Deploy

Once environment variables are set, Render will automatically build and deploy.

## What Was Fixed:

1. ✅ **Build Process** - Now builds both client (React) and server
2. ✅ **Single Service** - Unified deployment (instead of separate client/server)
3. ✅ **Environment Variables** - Proper PhonePe Standard Checkout API configuration
4. ✅ **Removed Warnings** - Old PhonePe integration warnings removed
5. ✅ **Client Serving** - Server properly serves built React app

## Files Modified:

- `build.sh` - New build script that builds both client and server
- `render.yaml` - Updated deployment configuration
- `server/helpers/phonepe.js` - Removed confusing warning message

## Testing After Deployment:

1. Visit: `https://yourdomain.onrender.com`
2. Check homepage loads
3. Test product listing
4. Try adding items to cart
5. Test checkout flow
6. Verify admin panel at `/admin`

## Admin Panel Access:

The admin panel is fully functional at `/admin`. 

**To create first admin user:**
1. Visit `/admin`
2. Use the "Bootstrap Admin" form
3. Enter email, password, and admin secret (check your env vars or ask dev)

## Features Available:

✅ Dynamic Products Management
✅ Categories Management  
✅ Combo Packs Creation
✅ Team Members Management
✅ Hero Slider Images Upload
✅ Image Gallery Management
✅ Order Management
✅ User Management
✅ PhonePe Payment Integration

## Troubleshooting:

### Build Fails:
- Check build logs for specific errors
- Ensure build.sh has execute permissions

### 404 Errors:
- Verify FRONTEND_URL is set correctly
- Check server logs for routing issues

### PhonePe 401 Error:
- Verify all PHONEPE_* environment variables are set
- Check credentials are correct
- Ensure PHONEPE_ENV is set to 'sandbox' for testing

### Database Connection Issues:
- Verify MONGODB_URI is correct
- Check MongoDB Atlas IP whitelist (should allow Render IPs or 0.0.0.0/0)

## Support:

If issues persist after following this guide, check:
1. Render build logs
2. Render runtime logs  
3. Browser console for client errors
4. Network tab for API call failures
