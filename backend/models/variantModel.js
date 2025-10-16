const mongoose = require('mongoose');
const variantSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name: String, sku: String, attributes: Object, price: Number, stock: { type: Number, default: 0 }
}, { timestamps: true });
module.exports = mongoose.model('Variant', variantSchema);
