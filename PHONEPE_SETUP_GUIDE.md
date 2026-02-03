# PhonePe Payment Gateway Setup Guide

## Overview
Your PhonePe Standard Checkout integration is already implemented. You just need to configure the API credentials.

## Step 1: Get Your PhonePe Credentials

### For Sandbox (Testing) Environment:
1. Log in to [PhonePe Business Dashboard](https://business.phonepe.com/)
2. Toggle **Test Mode ON** (located at the top of the dashboard)
3. Navigate to **Developer Settings** from the side menu
4. You'll find your credentials:
   - **Client ID**
   - **Client Secret**
   - **Client Version** (usually 1)
   - **Merchant ID**

### For Production Environment:
1. Complete UAT (User Acceptance Testing) with PhonePe team
2. Once UAT is approved, PhonePe will provide production credentials
3. Toggle **Test Mode OFF** in the dashboard
4. Navigate to **Developer Settings** to get production credentials

## Step 2: Configure Environment Variables

Open the file `server/.env` and update the following values:

```env
# Change this to 'production' when going live
PHONEPE_ENV=sandbox

# Replace with your actual credentials from PhonePe Dashboard
PHONEPE_CLIENT_ID=YOUR_CLIENT_ID_HERE
PHONEPE_CLIENT_SECRET=YOUR_CLIENT_SECRET_HERE
PHONEPE_CLIENT_VERSION=1
PHONEPE_MERCHANT_ID=YOUR_MERCHANT_ID_HERE

# Set webhook credentials for security
PHONEPE_WEBHOOK_USER=your-chosen-username
PHONEPE_WEBHOOK_PASSWORD=your-chosen-password

# Update callback URL for production
PHONEPE_CALLBACK_URL=http://localhost:5173/order-confirmation
```

## Step 3: Configure Webhook in PhonePe Dashboard

Webhooks allow PhonePe to send real-time payment status updates to your server.

### Setup Steps:
1. Log in to **PhonePe Business Dashboard**
2. Set the environment (Test Mode toggle ON/OFF)
3. Go to **Developer Settings** → **Webhook** tab
4. Click **Create Webhook**
5. Fill in the following details:

   **For Local Testing (using ngrok or similar):**
   ```
   Webhook URL: https://your-ngrok-url.ngrok.io/api/shop/payment/phonepe/webhook
   Username: your-chosen-username (same as PHONEPE_WEBHOOK_USER)
   Password: your-chosen-password (same as PHONEPE_WEBHOOK_PASSWORD)
   Description: Order and Refund Webhooks
   ```

   **For Production:**
   ```
   Webhook URL: https://yourdomain.com/api/shop/payment/phonepe/webhook
   Username: your-webhook-username
   Password: your-webhook-password
   Description: Order and Refund Webhooks
   ```

6. Select the following events:
   - ✅ `checkout.order.completed` - Order payment successful
   - ✅ `checkout.order.failed` - Order payment failed
   - ✅ `pg.refund.completed` - Refund successful
   - ✅ `pg.refund.failed` - Refund failed

7. Click **Create** to save

## Step 4: Test Your Integration

### Start Your Server:
```bash
cd server
npm install
node server.js
```

### Start Your Client:
```bash
cd client
npm install
npm run dev
```

### Test Payment Flow:
1. Add items to cart
2. Go to checkout
3. Fill in customer details
4. Click "Pay Now"
5. You'll see the PhonePe checkout page
6. Use test credentials provided by PhonePe for sandbox testing

### PhonePe Sandbox Test Cards:
PhonePe will provide test UPI IDs and card details for sandbox testing. Check their documentation or contact support.

## Step 5: Verify Payment Status

After completing a test payment:
1. Check your database - order status should update
2. Check server logs for webhook callbacks
3. Verify the order confirmation page loads correctly

## Step 6: Production Checklist

Before going live:

### Code Changes:
- [ ] Update `PHONEPE_ENV=production` in `.env`
- [ ] Replace sandbox credentials with production credentials
- [ ] Update `PHONEPE_CALLBACK_URL` to your production domain
- [ ] Set production webhook URL in PhonePe Dashboard

### Testing:
- [ ] Complete all UAT test cases with PhonePe team
- [ ] Test all payment modes (UPI, Cards, Net Banking)
- [ ] Test webhook delivery
- [ ] Test order status API
- [ ] Test refund flow (if implemented)
- [ ] Test payment failure scenarios

### Security:
- [ ] Use strong JWT_SECRET
- [ ] Use secure webhook credentials
- [ ] Enable HTTPS on production server
- [ ] Verify webhook signature properly

### Monitoring:
- [ ] Set up error logging
- [ ] Monitor payment success/failure rates
- [ ] Set up alerts for webhook failures
- [ ] Regular reconciliation with PhonePe dashboard

## API Endpoints in Your Application

Your application has the following PhonePe endpoints:

```
POST   /api/shop/payment/phonepe/initiate    - Create payment session
GET    /api/shop/payment/phonepe/status/:merchantOrderId - Check payment status
POST   /api/shop/payment/phonepe/webhook     - Receive PhonePe callbacks
POST   /api/shop/payment/phonepe/refund      - Initiate refund
GET    /api/shop/payment/phonepe/refund-status/:merchantRefundId - Check refund status
```

## Troubleshooting

### Common Issues:

**1. "PHONEPE_CLIENT_ID/PHONEPE_CLIENT_SECRET not configured"**
- Check if `.env` file exists in server directory
- Verify credentials are correctly copied from PhonePe dashboard
- Restart your server after updating `.env`

**2. Webhook not receiving callbacks**
- Verify webhook URL is accessible from internet
- Use ngrok for local testing: `ngrok http 5000`
- Check webhook username/password match in dashboard and `.env`
- Verify webhook events are selected in dashboard

**3. Payment page not opening**
- Check browser console for errors
- Verify `redirectUrl` in response is being used correctly
- Check if PhonePe checkout script is loaded

**4. Token expiry errors**
- Token auto-refreshes 3 minutes before expiry
- Check system time is correct
- Verify token API is working correctly

## Support

For PhonePe related issues:
- Email: merchantsupport@phonepe.com
- Documentation: https://developer.phonepe.com/
- Dashboard: https://business.phonepe.com/

For integration code issues:
- Check server logs: `server/logs`
- Enable debug logging in PhonePe helper
- Test APIs using Postman/curl

## Important Notes

1. **Never commit `.env` file** - it contains sensitive credentials
2. **Test thoroughly in sandbox** before going to production
3. **Implement proper error handling** for payment failures
4. **Set up reconciliation** to match orders with PhonePe dashboard
5. **Keep credentials secure** - rotate them periodically

## Quick Start Commands

```bash
# Install dependencies
cd server && npm install
cd ../client && npm install

# Start in development
cd server && node server.js
cd client && npm run dev

# For production
cd client && npm run build
cd server && node server.js
```

Your PhonePe integration is ready to use once you add the credentials! 🎉
