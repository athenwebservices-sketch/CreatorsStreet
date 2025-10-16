const mongoose = require('mongoose');
const paymentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  amount: { type: Number, required: true }, status: String, method: String, meta: Object, createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Payment', paymentSchema);
