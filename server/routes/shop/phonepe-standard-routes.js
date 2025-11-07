const express = require('express');
const { initiate, status, webhook, refund, refundStatus } = require('../../controllers/shop/phonepe-standard-controller');

const router = express.Router();

// Initiate payment session
router.post('/initiate', initiate);
// Poll/check status
router.get('/status/:merchantOrderId', status);
// Webhook
router.post('/webhook', express.json({ type: '*/*' }), webhook);
// Refunds (optional)
router.post('/refund', refund);
router.get('/refund/:merchantRefundId/status', refundStatus);

module.exports = router;
