const mongoose = require('mongoose');
const viewSchema = new mongoose.Schema({ product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }, user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, viewedAt: { type: Date, default: Date.now } });
module.exports = mongoose.model('View', viewSchema);
