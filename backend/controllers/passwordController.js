const PasswordReset = require('../models/passwordResetModel');
const User = require('../models/userModel');
const { v4: uuidv4 } = require('uuid');
const sendMail = require('../config/mailConfig');

exports.forgot = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(200).json({ message: 'If account exists, reset email sent.' });
    }

    // Generate OTP and session token
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const sessionToken = uuidv4();

    // Store OTP in database with expiration
    await PasswordReset.create({
      userId: user._id,
      token: otp, // Using token field to store OTP
      expiresAt: new Date(Date.now() + 3600 * 1000), // 1 hour expiration
      sessionToken: sessionToken
    });

    // Send OTP via email
    await sendMail({
      to: email,
      subject: 'Your OTP for Password Reset',
      text: `Your OTP for password reset is: ${otp}`,
      html: `<p>Your OTP for password reset is: <b>${otp}</b></p>`,
    });

    console.log('Password reset OTP for', email, 'is:', otp);
    
    res.json({
      message: 'Password reset OTP sent to email',
      sessionToken,
      otp // Remove this in production
    });
  } catch (e) {
    next(e);
  }
};

exports.reset = async (req, res, next) => {
  try {
    const { otp, password, sessionToken } = req.body;
    
    // Find the password reset record with OTP and session token
    const pr = await PasswordReset.findOne({ 
      token: otp, // OTP is stored in token field
      sessionToken: sessionToken 
    });
    
    // if (!pr || pr.expiresAt < new Date()) {
    //   return res.status(400).json({ message: 'Invalid or expired OTP' });
    // }

    const user = await User.findById(pr.userId);
    await user.setPassword(password);
    await user.save();
    
    // Delete the password reset record
    await pr.deleteOne();
    
    res.json({ message: 'Password reset successful' });
  } catch (e) {
    next(e);
  }
};
