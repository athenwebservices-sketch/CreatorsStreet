const User = require('../models/userModel');

exports.findByEmail = async (email) => {
  return await User.findOne({ email });
};

exports.createUser = async (data) => {
  const user = new User(data);
  return await user.save();
};
