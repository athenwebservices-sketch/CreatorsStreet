// controllers/razorpayController.js
const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/orderModel'); // your existing order model

// initialize Razorpay instance using environment variables
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ✅ create Razorpay order
exports.createRazorpayOrder = async (req, res, next) => {
  try {
    const { amount, items, currency } = req.body;
    const userId = req.user._id;

    if (!amount) return res.status(400).json({ message: 'Amount required' });

    // (Optional) create your internal order record
    const dbOrder = await Order.create({
      orderNumber: 'ORD-' + Date.now(),
      userId,
      items: items || [],
      subtotal: amount / 100,
      totalAmount: amount / 100,
      currency: currency || 'INR',
      paymentMethod: 'razorpay',
      paymentStatus: 'pending',
    });

    // create order on Razorpay
    const options = {
      amount, // amount in paise
      currency: currency || 'INR',
      receipt: dbOrder._id.toString(),
    };

    const razorpayOrder = await razorpay.orders.create(options);

    // attach razorpay order id to db order
    dbOrder.razorpayOrderId = razorpayOrder.id;
    await dbOrder.save();

    res.json({
      id: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      key: process.env.RAZORPAY_KEY_ID,
      dbOrderId: dbOrder._id,
    });
  } catch (err) {
    console.error('Razorpay create order error:', err);
    next(err);
  }
};

// ✅ verify Razorpay payment
exports.verifyPayment = async (req, res, next) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ message: 'Invalid payment data' });
    }

    // verify signature
    const generated_signature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + '|' + razorpay_payment_id)
      .digest('hex');

    if (generated_signature !== razorpay_signature) {
      return res.status(400).json({ message: 'Invalid signature' });
    }

    // find the related order
    const dbOrder = await Order.findOne({ razorpayOrderId: razorpay_order_id });
    if (dbOrder) {
      dbOrder.paymentStatus = 'paid';
      dbOrder.paymentId = razorpay_payment_id;
      await dbOrder.save();
    }

    res.json({
      success: true,
      message: 'Payment verified successfully',
      orderId: dbOrder ? dbOrder._id : null,
    });
  } catch (err) {
    console.error('Razorpay verify error:', err);
    next(err);
  }
};
