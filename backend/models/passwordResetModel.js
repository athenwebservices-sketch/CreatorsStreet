const mongoose = require('mongoose');
const passwordResetSchema = new mongoose.Schema({ userId: mongoose.Schema.Types.ObjectId, token: String, expiresAt: Date });
module.exports = mongoose.model('PasswordReset', passwordResetSchema);
