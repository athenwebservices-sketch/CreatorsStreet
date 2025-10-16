const mongoose = require('mongoose');
const returnSchema = new mongoose.Schema({
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, default: 'requested' }, reason: String, requestedAt: { type: Date, default: Date.now },
  items: [Object], refundAmount: Number
});
module.exports = mongoose.model('Return', returnSchema);
