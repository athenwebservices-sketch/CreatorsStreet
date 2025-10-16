const mongoose = require('mongoose');
const templateSchema = new mongoose.Schema({
  type: { type: String, unique: true }, channel: String, subjectTemplate: String, bodyTemplate: String, isActive: { type: Boolean, default: true }
});
module.exports = mongoose.model('Template', templateSchema);
