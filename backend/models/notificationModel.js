const mongoose = require('mongoose');
const notificationSchema = new mongoose.Schema({
  recipientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, type: String, channel: String, status: String,
  subject: String, content: String, data: Object, sentAt: Date, readAt: Date, failureReason: String, createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Notification', notificationSchema);
