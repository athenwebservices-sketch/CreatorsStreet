const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const addressSchema = new mongoose.Schema({
  type: { type: String, enum: ['shipping','billing','both'], default: 'shipping' },
  isDefault: { type: Boolean, default: false },
  street: String, city: String, state: String, zipCode: String, country: String
}, { _id: true });

const paymentMethodSchema = new mongoose.Schema({
  type: String, provider: String, providerToken: String, last4Digits: String, cardBrand: String,
  expiryMonth: Number, expiryYear: Number, isDefault: Boolean
}, { _id: true });

const userSchema = new mongoose.Schema({
  firstName: String, lastName: String, email: { type: String, required: true, unique: true },
  passwordHash: String, role: { type: String, enum: ['customer','admin','superadmin'], default: 'customer' },
  isActive: { type: Boolean, default: true }, isEmailVerified: { type: Boolean, default: false },
  lastLoginAt: Date, profileImage: String, phone: String,
  addresses: [addressSchema], paymentMethods: [paymentMethodSchema],
  createdAt: { type: Date, default: Date.now }, updatedAt: Date
});

userSchema.methods.setPassword = async function(password) {
  const salt = await bcrypt.genSalt(10);
  this.passwordHash = await bcrypt.hash(password, salt);
};

userSchema.methods.matchPassword = async function(password) {
  const bcrypt = require('bcrypt');
  return await bcrypt.compare(password, this.passwordHash || '');
};

module.exports = mongoose.model('User', userSchema);
