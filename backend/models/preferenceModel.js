const mongoose = require('mongoose');
const prefSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, preferences: Object, updatedAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Preference', prefSchema);
