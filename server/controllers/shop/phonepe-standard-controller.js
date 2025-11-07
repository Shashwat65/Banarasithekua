const Order = require('../../models/Order');
const phonePeStd = require('../../helpers/phonepe-standard');

// Utility: generate merchantOrderId (<=63 chars, allowed _ -)
function genMerchantOrderId(orderDbId) {
  return `ORD_${orderDbId}_${Date.now()}`.replace(/[^A-Za-z0-9_-]/g, '').slice(0, 63);
}

// Initiate: create order (if not existing) + create PhonePe payment session
// Expects body: { items, customer, amount }
// Returns: { orderId, merchantOrderId, redirectUrl, state }
async function initiate(req, res) {
  try {
    const { items, customer, amount } = req.body;
    if (!Array.isArray(items) || !items.length) {
      return res.status(400).json({ success: false, message: 'Missing cart items' });
    }
    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid amount' });
    }

    // Create minimal order record (UI unchanged)
    const order = new Order({
      userId: customer?.userId || 'guest',
      cartItems: items.map(i => ({
        productId: i.id || i.productId,
        title: i.name || i.title,
        image: i.image,
        price: String(i.price),
        quantity: i.quantity || 1,
      })),
      addressInfo: {
        address: customer?.address,
        city: customer?.city,
        pincode: customer?.postalCode,
        phone: customer?.phone,
        notes: customer?.notes,
      },
      orderStatus: 'pending',
      paymentMethod: 'phonepe-standard',
      paymentStatus: 'pending',
      totalAmount: amount,
      orderDate: new Date(),
      orderUpdateDate: new Date(),
    });
    await order.save();

    const merchantOrderId = genMerchantOrderId(order._id.toString());
    const redirectUrl = process.env.PHONEPE_CALLBACK_URL || 'http://localhost:5173/order-confirmation/' + order._id.toString();

    // metaInfo subset (map name/email if present)
    const metaInfo = {};
    if (customer?.name) metaInfo.udf1 = customer.name;
    if (customer?.email) metaInfo.udf2 = customer.email;

    const paymentResp = await phonePeStd.createPaymentSession({
      merchantOrderId,
      amountPaise: Math.round(amount * 100),
      redirectUrl,
      metaInfo,
    });

    if (paymentResp.state !== 'PENDING') {
      return res.status(500).json({ success: false, message: 'Unexpected state creating order', data: paymentResp });
    }

    // Persist standard fields
    order.merchantOrderId = merchantOrderId;
    order.phonepeOrderId = paymentResp.orderId;
    order.phonepeRedirectUrl = paymentResp.redirectUrl;
    order.phonepeState = paymentResp.state;
    order.phonepeMetaInfo = metaInfo;
    await order.save();

    res.json({
      success: true,
      orderId: order._id,
      merchantOrderId,
      redirectUrl: paymentResp.redirectUrl,
      state: paymentResp.state,
    });
  } catch (err) {
    console.error('PhonePe initiate error', err.response?.data || err.message);
    res.status(500).json({ success: false, message: 'Initiation failed', error: err.response?.data || err.message });
  }
}

// Poll / status
async function status(req, res) {
  try {
    const { merchantOrderId } = req.params;
    if (!merchantOrderId) return res.status(400).json({ success: false, message: 'Missing merchantOrderId' });

    const resp = await phonePeStd.getOrderStatus(merchantOrderId, { details: true, errorContext: true });
    // Update order record
    const order = await Order.findOne({ merchantOrderId });
    if (order) {
      order.phonepeState = resp.state;
      order.phonepePaymentDetails = resp.paymentDetails;
      order.orderUpdateDate = new Date();
      if (resp.state === 'COMPLETED') {
        order.paymentStatus = 'paid';
        order.orderStatus = 'confirmed';
      } else if (resp.state === 'FAILED') {
        order.paymentStatus = 'failed';
        order.orderStatus = 'cancelled';
      }
      await order.save();
    }

    res.json({ success: true, data: resp });
  } catch (err) {
    console.error('PhonePe status error', err.response?.data || err.message);
    res.status(500).json({ success: false, message: 'Status check failed', error: err.response?.data || err.message });
  }
}

// Webhook handler
async function webhook(req, res) {
  try {
    const authHeader = req.headers['authorization'];
    if (!phonePeStd.verifyWebhookAuth(authHeader)) {
      return res.status(401).json({ success: false, message: 'Invalid webhook auth' });
    }

    const { event, payload } = req.body || {};
    if (!event || !payload?.merchantOrderId) {
      return res.status(400).json({ success: false, message: 'Malformed webhook payload' });
    }

    const order = await Order.findOne({ merchantOrderId: payload.merchantOrderId });
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Update based on payload.state
    order.phonepeState = payload.state;
    if (payload.paymentDetails) order.phonepePaymentDetails = payload.paymentDetails;
    if (payload.state === 'COMPLETED') {
      order.paymentStatus = 'paid';
      order.orderStatus = 'confirmed';
    } else if (payload.state === 'FAILED') {
      order.paymentStatus = 'failed';
      order.orderStatus = 'cancelled';
    }
    order.orderUpdateDate = new Date();
    await order.save();

    res.json({ success: true });
  } catch (err) {
    console.error('PhonePe webhook error', err.response?.data || err.message);
    res.status(500).json({ success: false, message: 'Webhook processing failed' });
  }
}

// Refund (optional; skeleton)
async function refund(req, res) {
  try {
    const { merchantOrderId, amountPaise } = req.body;
    if (!merchantOrderId || !amountPaise) {
      return res.status(400).json({ success: false, message: 'merchantOrderId & amountPaise required' });
    }
    const merchantRefundId = `RF_${merchantOrderId}_${Date.now()}`.slice(0, 63);
    const data = await phonePeStd.refund({ merchantRefundId, originalMerchantOrderId: merchantOrderId, amountPaise });

    // Attach to order
    const order = await Order.findOne({ merchantOrderId });
    if (order) {
      order.phonepeRefunds = order.phonepeRefunds || [];
      order.phonepeRefunds.push({ merchantRefundId, request: { amountPaise }, response: data });
      await order.save();
    }

    res.json({ success: true, data });
  } catch (err) {
    console.error('PhonePe refund error', err.response?.data || err.message);
    res.status(500).json({ success: false, message: 'Refund failed', error: err.response?.data || err.message });
  }
}

async function refundStatus(req, res) {
  try {
    const { merchantRefundId } = req.params;
    if (!merchantRefundId) return res.status(400).json({ success: false, message: 'Missing merchantRefundId' });
    const data = await phonePeStd.refundStatus(merchantRefundId);
    res.json({ success: true, data });
  } catch (err) {
    console.error('PhonePe refund status error', err.response?.data || err.message);
    res.status(500).json({ success: false, message: 'Refund status failed', error: err.response?.data || err.message });
  }
}

module.exports = { initiate, status, webhook, refund, refundStatus };
