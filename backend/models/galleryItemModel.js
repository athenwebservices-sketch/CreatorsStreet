const mongoose = require('mongoose');

const galleryItemSchema = new mongoose.Schema({
  galleryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Gallery', required: true },
  mediaUrl: { type: String, required: true },
  mediaType: { type: String, enum: ['image','video'], required: true },
  thumbnailUrl: String,
  caption: String,
  altText: String,
  source: { type: String, enum: ['admin','customer'], default: 'admin' },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  linkedProductId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  linkedVariantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Variant' },
  sortOrder: { type: Number, default: 0 },
  isApproved: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('GalleryItem', galleryItemSchema);
