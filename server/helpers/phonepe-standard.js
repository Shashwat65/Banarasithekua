const axios = require('axios');

/**
 * PhonePe Standard Checkout helper using OAuth (O-Bearer) and Checkout v2 APIs
 * Implements:
 * - Token generation and caching
 * - Create payment (PayPage)
 * - Check order status
 * - Refund + Refund status (skeleton)
 * - Webhook Authorization header verification (SHA256(username:password))
 */
class PhonePeStandard {
  constructor() {
    this.env = (process.env.PHONEPE_ENV || 'sandbox').toLowerCase();
    // Base URLs per docs
    this.baseAuthUrl = this.env === 'production'
      ? 'https://api.phonepe.com/apis/identity-manager'
      : 'https://api-preprod.phonepe.com/apis/pg-sandbox';

    this.basePgUrl = this.env === 'production'
      ? 'https://api.phonepe.com/apis/pg'
      : 'https://api-preprod.phonepe.com/apis/pg-sandbox';

    // OAuth client credentials
    this.clientId = process.env.PHONEPE_CLIENT_ID;
    this.clientSecret = process.env.PHONEPE_CLIENT_SECRET;
    this.clientVersion = process.env.PHONEPE_CLIENT_VERSION || 1;

    // Merchant config
    this.merchantId = process.env.PHONEPE_MERCHANT_ID; // still used in responses/webhooks mapping

    // Webhook basic auth for verification (hashed by PhonePe)
    this.webhookUser = process.env.PHONEPE_WEBHOOK_USER || '';
    this.webhookPassword = process.env.PHONEPE_WEBHOOK_PASSWORD || '';

    // Token cache
    this._token = null;
    this._tokenExpiry = 0; // epoch seconds
  }

  _now() {
    return Math.floor(Date.now() / 1000);
  }

  /**
   * Get OAuth token, using cache when valid. Refresh 3 minutes before expiry.
   */
  async getToken() {
    const now = this._now();
    if (this._token && this._tokenExpiry - now > 180) {
      return this._token;
    }

    if (!this.clientId || !this.clientSecret) {
      throw new Error('PHONEPE_CLIENT_ID/PHONEPE_CLIENT_SECRET not configured');
    }

    const url = `${this.baseAuthUrl}/v1/oauth/token`;
    const params = new URLSearchParams();
    params.append('client_id', this.clientId);
    params.append('client_version', String(this.clientVersion));
    params.append('client_secret', this.clientSecret);
    params.append('grant_type', 'client_credentials');

    const res = await axios.post(url, params.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      timeout: 15000,
    });

    const data = res.data || {};
    if (!data.access_token) {
      throw new Error('No access_token in PhonePe token response');
    }
    this._token = data.access_token;
    // Prefer expires_at epoch seconds; fallback 25min
    const nowSec = this._now();
    const expiresAt = typeof data.expires_at === 'number' ? data.expires_at : nowSec + 1500;
    this._tokenExpiry = expiresAt;
    return this._token;
  }

  /**
   * Create a payment session
   * @param {Object} args
   * @param {string} args.merchantOrderId Unique order id (<=63 chars, alnum/_-)
   * @param {number} args.amountPaise Amount in paise
   * @param {string} args.redirectUrl Redirect URL after payment
   * @param {Object} [args.metaInfo] Optional meta info udf1..udf15
   * @param {Object} [args.paymentModeConfig] Optional enable/disable modes
   */
  async createPaymentSession({ merchantOrderId, amountPaise, redirectUrl, metaInfo, paymentModeConfig, expireAfter }) {
    const token = await this.getToken();
    const url = `${this.basePgUrl}/checkout/v2/pay`;
    const body = {
      merchantOrderId,
      amount: amountPaise,
      ...(expireAfter ? { expireAfter } : {}),
      ...(metaInfo ? { metaInfo } : {}),
      paymentFlow: {
        type: 'PG_CHECKOUT',
        merchantUrls: { redirectUrl },
        ...(paymentModeConfig ? { paymentModeConfig } : {}),
      },
    };

    const res = await axios.post(url, body, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `O-Bearer ${token}`,
      },
      timeout: 20000,
    });

    return res.data;
  }

  /**
   * Check order status
   */
  async getOrderStatus(merchantOrderId, { details = false, errorContext = false } = {}) {
    const token = await this.getToken();
    const url = `${this.basePgUrl}/checkout/v2/order/${encodeURIComponent(merchantOrderId)}/status`;
    const res = await axios.get(url, {
      params: { details, errorContext },
      headers: {
        'Content-Type': 'application/json',
        Authorization: `O-Bearer ${token}`,
      },
      timeout: 15000,
    });
    return res.data;
  }

  /**
   * Refund (skeleton; you can wire when needed)
   */
  async refund({ merchantRefundId, originalMerchantOrderId, amountPaise }) {
    const token = await this.getToken();
    const url = `${this.basePgUrl}/payments/v2/refund`;
    const body = { merchantRefundId, originalMerchantOrderId, amount: amountPaise };
    const res = await axios.post(url, body, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `O-Bearer ${token}`,
      },
      timeout: 15000,
    });
    return res.data;
  }

  async refundStatus(merchantRefundId) {
    const token = await this.getToken();
    const url = `${this.basePgUrl}/payments/v2/refund/${encodeURIComponent(merchantRefundId)}/status`;
    const res = await axios.get(url, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `O-Bearer ${token}`,
      },
      timeout: 15000,
    });
    return res.data;
  }

  /**
   * Verify webhook Authorization header per docs: SHA256(username:password)
   */
  verifyWebhookAuth(authHeader) {
    if (!this.webhookUser || !this.webhookPassword) return false;
    if (!authHeader) return false;
    const expected = require('crypto')
      .createHash('sha256')
      .update(`${this.webhookUser}:${this.webhookPassword}`)
      .digest('hex');
    // Header comes as e.g. Authorization: SHA256(username:password)
    const value = (authHeader || '').trim();
    const parts = value.split(' ');
    const hash = parts.length === 2 ? parts[1] : value;
    return hash === expected;
  }
}

module.exports = new PhonePeStandard();
