const mongoose = require('mongoose');
const priceHistorySchema = new mongoose.Schema({
  price: Number, changedAt: { type: Date, default: Date.now }, note: String
});

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: String, description: String, price: { type: Number, required: true, default: 0 },
  categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
  imageUrls: [{ url: String, alt: String }],
  videos: [{ url: String }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  featured: { type: Boolean, default: false },
  stock: { type: Number, default: 0 },
  variants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Variant' }],
  rating: { type: Number, default: 0 },
  reviewsCount: { type: Number, default: 0 },
  priceHistory: [priceHistorySchema],
  createdAt: { type: Date, default: Date.now }
});
productSchema.index({ name: 'text', description: 'text' });
module.exports = mongoose.model('Product', productSchema);
