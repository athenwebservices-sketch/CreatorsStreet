const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  variantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Variant' },
  productName: String, productImage: String, quantity: Number, price: Number
}, { _id: false });

const orderSchema = new mongoose.Schema({
  orderNumber: { type: String, unique: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, default: 'pending' },
  orderDate: { type: Date, default: Date.now },
  shippingAddress: Object, billingAddress: Object,
  paymentMethod: String, paymentStatus: String, paymentTransactionId: String,
  items: [orderItemSchema],
  subtotal: Number, taxAmount: Number, shippingCost: Number, totalAmount: Number, currency: { type: String, default: 'USD' }
});

module.exports = mongoose.model('Order', orderSchema);
