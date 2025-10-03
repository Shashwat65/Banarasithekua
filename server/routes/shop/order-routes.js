const express = require("express");

const {
  createOrder,
  getAllOrdersByUser,
  getOrderDetails,
  capturePayment,
  handlePhonePeCallback,
  checkPaymentStatus,
} = require("../../controllers/shop/order-controller");

const router = express.Router();

router.post("/create", createOrder);
router.post("/capture", capturePayment);
router.post("/phonepe-callback", handlePhonePeCallback);
router.get("/payment-status/:merchantTransactionId", checkPaymentStatus);
router.get("/list/:userId", getAllOrdersByUser);
router.get("/details/:id", getOrderDetails);

module.exports = router;
