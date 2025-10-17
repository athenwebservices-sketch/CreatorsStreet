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
      html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;"> <div style="text-align: center; margin-bottom: 20px;"> <h1 style="color: #3c0052; margin-bottom: 10px;">CreatorsStreet.in</h1> <h2 style="color: #555; font-size: 20px;">Verify Your Account</h2> </div> <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin-bottom: 20px;"> <p style="color: #333; line-height: 1.5;">Thank you for registering with CreatorsStreet.in. Please use the following One-Time Password (OTP) to verify your account and complete your registration process:</p> <div style="text-align: center; margin: 30px 0;"> <div style="display: inline-block; background-color: #fff; padding: 15px 25px; border: 2px dashed #3c0052; border-radius: 8px; letter-spacing: 8px; font-size: 24px; font-weight: bold; color: #3c0052;"> ${otp} </div> </div> <p style="color: #333; line-height: 1.5;">This OTP is valid for the next 10 minutes. If you did not request this, please disregard this message.</p> </div> /* <div style="text-align: center; margin-top: 30px;"> <p style="color: #666; font-size: 14px;">If you're having trouble with the OTP, you can:</p> <div style="display: flex; justify-content: center; gap: 15px; margin-top: 15px;"> <a href="#" style="display: inline-block; background-color: #3c0052; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Request New OTP</a> <a href="#" style="display: inline-block; background-color: #f0f0f0; color: #333; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Contact Support</a> </div> </div> */ <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center;"> <p style="color: #888; font-size: 12px;">This is an automated message. Please do not reply to this email.</p> <p style="color: #888; font-size: 12px;">© 2025 CreatorsStreet.in. All rights reserved.</p> </div> </div>`,
   
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
