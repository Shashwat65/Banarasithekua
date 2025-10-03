const phonePe = require("../../helpers/phonepe");
const Order = require("../../models/Order");
const Cart = require("../../models/Cart");
const Product = require("../../models/Product");

const createOrder = async (req, res) => {
  try {
    const {
      userId,
      cartItems,
      addressInfo,
      orderStatus,
      paymentMethod,
      paymentStatus,
      totalAmount,
      orderDate,
      orderUpdateDate,
      cartId,
      userPhone,
      userEmail,
      userName
    } = req.body;

    // Create order first
    const newlyCreatedOrder = new Order({
      userId,
      cartId,
      cartItems,
      addressInfo,
      orderStatus: orderStatus || "pending",
      paymentMethod: paymentMethod || "phonepe",
      paymentStatus: paymentStatus || "pending",
      totalAmount,
      orderDate: orderDate || new Date(),
      orderUpdateDate: orderUpdateDate || new Date(),
    });

    await newlyCreatedOrder.save();

    // Create PhonePe payment
    const paymentResult = await phonePe.createPayment({
      orderId: newlyCreatedOrder._id.toString(),
      amount: totalAmount,
      userId,
      userPhone,
      userEmail,
      userName
    });

    if (!paymentResult.success) {
      // If payment creation fails, delete the order
      await Order.findByIdAndDelete(newlyCreatedOrder._id);
      return res.status(500).json({
        success: false,
        message: "Error while creating PhonePe payment",
        error: paymentResult.error
      });
    }

    // Update order with payment details
    newlyCreatedOrder.merchantTransactionId = paymentResult.merchantTransactionId;
    await newlyCreatedOrder.save();

    res.status(201).json({
      success: true,
      paymentUrl: paymentResult.paymentUrl,
      orderId: newlyCreatedOrder._id,
      merchantTransactionId: paymentResult.merchantTransactionId
    });

  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occurred!",
    });
  }
};

const capturePayment = async (req, res) => {
  try {
    const { merchantTransactionId, orderId } = req.body;

    let order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order cannot be found",
      });
    }

    // Check payment status with PhonePe
    const statusResult = await phonePe.checkPaymentStatus(merchantTransactionId);

    if (!statusResult.success) {
      return res.status(500).json({
        success: false,
        message: "Error checking payment status",
        error: statusResult.error
      });
    }

    const paymentData = statusResult.data;
    
    if (paymentData.success && paymentData.data.state === 'COMPLETED') {
      order.paymentStatus = "paid";
      order.orderStatus = "confirmed";
      order.phonepeTransactionId = paymentData.data.transactionId;
      order.orderUpdateDate = new Date();

      // Update product stock
      for (let item of order.cartItems) {
        let product = await Product.findById(item.productId);

        if (!product) {
          return res.status(404).json({
            success: false,
            message: `Product not found: ${item.title}`,
          });
        }

        if (product.totalStock < item.quantity) {
          return res.status(400).json({
            success: false,
            message: `Not enough stock for product: ${product.title}`,
          });
        }

        product.totalStock -= item.quantity;
        await product.save();
      }

      // Delete cart after successful payment
      const getCartId = order.cartId;
      await Cart.findByIdAndDelete(getCartId);

      await order.save();

      res.status(200).json({
        success: true,
        message: "Payment confirmed and order processed",
        data: order,
      });
    } else {
      // Payment failed or pending
      order.paymentStatus = paymentData.data.state === 'FAILED' ? "failed" : "pending";
      await order.save();

      res.status(400).json({
        success: false,
        message: `Payment ${paymentData.data.state.toLowerCase()}`,
        paymentStatus: paymentData.data.state
      });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occurred!",
    });
  }
};

const getAllOrdersByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const orders = await Order.find({ userId });

    if (!orders.length) {
      return res.status(404).json({
        success: false,
        message: "No orders found!",
      });
    }

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

const getOrderDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found!",
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

// Handle PhonePe callback
const handlePhonePeCallback = async (req, res) => {
  try {
    const { merchantTransactionId, orderId } = req.body;

    if (!merchantTransactionId) {
      return res.status(400).json({
        success: false,
        message: "Missing merchant transaction ID"
      });
    }

    // Check payment status
    const statusResult = await phonePe.checkPaymentStatus(merchantTransactionId);
    
    if (!statusResult.success) {
      return res.status(500).json({
        success: false,
        message: "Error checking payment status"
      });
    }

    const paymentData = statusResult.data;
    
    // Find order by merchant transaction ID
    const order = await Order.findOne({ merchantTransactionId });
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    // Update order based on payment status
    if (paymentData.success && paymentData.data.state === 'COMPLETED') {
      order.paymentStatus = "paid";
      order.orderStatus = "confirmed";
    } else if (paymentData.data.state === 'FAILED') {
      order.paymentStatus = "failed";
      order.orderStatus = "cancelled";
    }

    order.phonepeTransactionId = paymentData.data.transactionId;
    order.orderUpdateDate = new Date();
    await order.save();

    res.status(200).json({
      success: true,
      data: {
        paymentStatus: paymentData.data.state,
        order: order
      }
    });

  } catch (error) {
    console.error('PhonePe callback error:', error);
    res.status(500).json({
      success: false,
      message: "Callback processing failed"
    });
  }
};

// Check payment status
const checkPaymentStatus = async (req, res) => {
  try {
    const { merchantTransactionId } = req.params;
    
    const statusResult = await phonePe.checkPaymentStatus(merchantTransactionId);
    
    if (!statusResult.success) {
      return res.status(500).json({
        success: false,
        message: "Error checking payment status"
      });
    }

    res.status(200).json({
      success: true,
      data: statusResult.data
    });

  } catch (error) {
    console.error('Payment status check error:', error);
    res.status(500).json({
      success: false,
      message: "Status check failed"
    });
  }
};

module.exports = {
  createOrder,
  capturePayment,
  getAllOrdersByUser,
  getOrderDetails,
  handlePhonePeCallback,
  checkPaymentStatus,
};
