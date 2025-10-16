const mongoose = require('mongoose');
const shipmentSchema = new mongoose.Schema({
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  trackingNumber: String, carrier: String, shippedAt: Date, estimatedDelivery: Date,
  status: { type: String, default: 'in_transit' }, items: [Object], createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Shipment', shipmentSchema);
