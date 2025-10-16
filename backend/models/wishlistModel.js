const mongoose = require('mongoose');
const wishlistSchema = new mongoose.Schema({ userId: mongoose.Schema.Types.ObjectId, productId: mongoose.Schema.Types.ObjectId, variantId: mongoose.Schema.Types.ObjectId, addedAt: Date });
module.exports = mongoose.model('Wishlist', wishlistSchema);
