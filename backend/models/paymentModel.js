// models/paymentModel.js

const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  amount: { type: Number},
  
  // Razorpay fields
  razorpay_order_id: { type: String,  unique: true, sparse: true },
  razorpay_payment_id: { type: String, unique: true, sparse: true },
  signature: { type: String  }, // Renamed from razorpay_signature for brevity

  status: { type: String, default: 'completed' }, // Assuming status is completed upon saving
  method: { type: String, default: 'razorpay' }, // Assuming method is razorpay
  meta: Object,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Payment', paymentSchema);