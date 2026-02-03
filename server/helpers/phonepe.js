const crypto = require('crypto');
const axios = require('axios');

class PhonePeHelper {
  constructor() {
    this.merchantId = process.env.PHONEPE_MERCHANT_ID;
    this.saltKey = process.env.PHONEPE_SALT_KEY;
    this.saltIndex = process.env.PHONEPE_SALT_INDEX || 1;
    this.env = process.env.PHONEPE_ENV || 'sandbox';
    this.callbackUrl = process.env.PHONEPE_CALLBACK_URL || 'http://localhost:5173/payment/callback';
    
    // PhonePe API URLs
    this.baseUrl = this.env === 'production' 
      ? 'https://api.phonepe.com/apis/hermes'
      : 'https://api-preprod.phonepe.com/apis/pg-sandbox';
  }

  // Generate checksum for PhonePe API calls
  generateChecksum(payload) {
    const string = payload + '/pg/v1/pay' + this.saltKey;
    return crypto.createHash('sha256').update(string).digest('hex') + '###' + this.saltIndex;
  }

  // Generate checksum for status check
  generateStatusChecksum(merchantTransactionId) {
    const string = `/pg/v1/status/${this.merchantId}/${merchantTransactionId}` + this.saltKey;
    return crypto.createHash('sha256').update(string).digest('hex') + '###' + this.saltIndex;
  }

  // Create payment request
  async createPayment(orderData) {
    try {
      const { orderId, amount, userId, userPhone, userEmail, userName } = orderData;
      
      const merchantTransactionId = `TXN_${orderId}_${Date.now()}`;
      
      const payload = {
        merchantId: this.merchantId,
        merchantTransactionId,
        merchantUserId: `USER_${userId}`,
        amount: Math.round(amount * 100), // Amount in paise
        redirectUrl: `${this.callbackUrl}?orderId=${orderId}`,
        redirectMode: 'POST',
        callbackUrl: `${process.env.FRONTEND_URL}/api/phonepe/callback`,
        mobileNumber: userPhone || '9999999999',
        paymentInstrument: {
          type: 'PAY_PAGE'
        }
      };

      const base64Payload = Buffer.from(JSON.stringify(payload)).toString('base64');
      const checksum = this.generateChecksum(base64Payload);

      const response = await axios.post(`${this.baseUrl}/pg/v1/pay`, {
        request: base64Payload
      }, {
        headers: {
          'Content-Type': 'application/json',
          'X-VERIFY': checksum,
          'accept': 'application/json'
        }
      });

      return {
        success: true,
        data: response.data,
        merchantTransactionId,
        paymentUrl: response.data?.data?.instrumentResponse?.redirectInfo?.url
      };
    } catch (error) {
      console.error('PhonePe Payment Creation Error:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data || error.message
      };
    }
  }

  // Check payment status
  async checkPaymentStatus(merchantTransactionId) {
    try {
      const checksum = this.generateStatusChecksum(merchantTransactionId);
      
      const response = await axios.get(
        `${this.baseUrl}/pg/v1/status/${this.merchantId}/${merchantTransactionId}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'X-VERIFY': checksum,
            'X-MERCHANT-ID': this.merchantId,
            'accept': 'application/json'
          }
        }
      );

      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('PhonePe Status Check Error:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data || error.message
      };
    }
  }

  // Verify callback signature
  verifyCallback(receivedChecksum, payload) {
    const expectedChecksum = crypto
      .createHash('sha256')
      .update(payload + this.saltKey)
      .digest('hex') + '###' + this.saltIndex;
    
    return receivedChecksum === expectedChecksum;
  }
}

// Create and export singleton instance
const phonePeHelper = new PhonePeHelper();

// Legacy PhonePe - Standard Checkout API is used in production (see phonepe-standard.js)
// Validation removed to avoid confusion

module.exports = phonePeHelper;