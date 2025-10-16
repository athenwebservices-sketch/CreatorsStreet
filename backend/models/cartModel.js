const mongoose = require('mongoose');
const cartItemSchema = new mongoose.Schema({ productId: mongoose.Schema.Types.ObjectId, variantId: mongoose.Schema.Types.ObjectId, quantity: Number, addedAt: Date });
const cartSchema = new mongoose.Schema({ userId: mongoose.Schema.Types.ObjectId, sessionId: String, items: [cartItemSchema], updatedAt: Date });
module.exports = mongoose.model('Cart', cartSchema);
