const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwtConfig');
const Session = require('../models/sessionModel');
const { v4: uuidv4 } = require('uuid');

const signToken = (user) => jwt.sign({ id: user._id, email: user.email, role: user.role }, jwtConfig.secret);
const sendMail = require('../config/mailConfig');

exports.register = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password, role } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

    // Check if user exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      // If the user exists but is not verified, send OTP again
      if (!existingUser.isEmailVerified) {
        // Send OTP again and create a new session token
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const sessionToken = uuidv4();
        const session = await Session.findOneAndUpdate(
          { userId: existingUser._id },
          { token: sessionToken, lastUsedAt: new Date() },
          { upsert: true, new: true }
        );
        await sendMail({
          to: email,
          subject: 'Your OTP for Registration',
           html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;"> <div style="text-align: center; margin-bottom: 20px;"> <h1 style="color: #3c0052; margin-bottom: 10px;">CreatorsStreet.in</h1> <h2 style="color: #555; font-size: 20px;">Verify Your Account</h2> </div> <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin-bottom: 20px;"> <p style="color: #333; line-height: 1.5;">Thank you for registering with CreatorsStreet.in. Please use the following One-Time Password (OTP) to verify your account and complete your registration process:</p> <div style="text-align: center; margin: 30px 0;"> <div style="display: inline-block; background-color: #fff; padding: 15px 25px; border: 2px dashed #3c0052; border-radius: 8px; letter-spacing: 8px; font-size: 24px; font-weight: bold; color: #3c0052;"> ${otp} </div> </div> <p style="color: #333; line-height: 1.5;">This OTP is valid for the next 10 minutes. If you did not request this, please disregard this message.</p> </div> /* <div style="text-align: center; margin-top: 30px;"> <p style="color: #666; font-size: 14px;">If you're having trouble with the OTP, you can:</p> <div style="display: flex; justify-content: center; gap: 15px; margin-top: 15px;"> <a href="#" style="display: inline-block; background-color: #3c0052; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Request New OTP</a> <a href="#" style="display: inline-block; background-color: #f0f0f0; color: #333; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Contact Support</a> </div> </div> */ <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center;"> <p style="color: #888; font-size: 12px;">This is an automated message. Please do not reply to this email.</p> <p style="color: #888; font-size: 12px;">© 2025 CreatorsStreet.in. All rights reserved.</p> </div> </div>`,
   
        });
        console.log('Registration OTP for', email, 'is:', otp);
        return res.status(200).json({
          message: 'User already exists but not verified. OTP sent again.',
          sessionToken,
          otp: otp
        });
      }
      return res.status(400).json({ message: 'User already exists and is verified.' });
    }

    // Create new user if not found
    let finalRole = 'customer';
    if (role && role !== 'customer') {
      const creatorRole = req.headers['x-creator-role'];
      if (creatorRole !== 'superadmin') return res.status(403).json({ message: 'Only Super Admin can create non-customer users' });
      finalRole = role;
    }

    const user = new User({ firstName, lastName, email, role: finalRole });
    await user.setPassword(password);
    await user.save();

    // Send OTP and create session token
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const sessionToken = uuidv4();
    const session = new Session({ userId: user._id, token: sessionToken, lastUsedAt: new Date() });
    await session.save();
    await sendMail({
      to: email,
          subject: 'Your OTP for Registration',
          html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;"> <div style="text-align: center; margin-bottom: 20px;"> <h1 style="color: #3c0052; margin-bottom: 10px;">CreatorsStreet.in</h1> <h2 style="color: #555; font-size: 20px;">Verify Your Account</h2> </div> <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin-bottom: 20px;"> <p style="color: #333; line-height: 1.5;">Thank you for registering with CreatorsStreet.in. Please use the following One-Time Password (OTP) to verify your account and complete your registration process:</p> <div style="text-align: center; margin: 30px 0;"> <div style="display: inline-block; background-color: #fff; padding: 15px 25px; border: 2px dashed #3c0052; border-radius: 8px; letter-spacing: 8px; font-size: 24px; font-weight: bold; color: #3c0052;"> ${otp} </div> </div> <p style="color: #333; line-height: 1.5;">This OTP is valid for the next 10 minutes. If you did not request this, please disregard this message.</p> </div> /* <div style="text-align: center; margin-top: 30px;"> <p style="color: #666; font-size: 14px;">If you're having trouble with the OTP, you can:</p> <div style="display: flex; justify-content: center; gap: 15px; margin-top: 15px;"> <a href="#" style="display: inline-block; background-color: #3c0052; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Request New OTP</a> <a href="#" style="display: inline-block; background-color: #f0f0f0; color: #333; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Contact Support</a> </div> </div> */ <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center;"> <p style="color: #888; font-size: 12px;">This is an automated message. Please do not reply to this email.</p> <p style="color: #888; font-size: 12px;">© 2025 CreatorsStreet.in. All rights reserved.</p> </div> </div>`,
   
    });

    console.log(`Registration OTP sent to ${email}`);
    res.status(201).json({
      message: 'User created. OTP sent to email. Use /verify-otp with otp and sessionToken.',
      sessionToken,
      otp // you can remove this in production
    });
    console.log('Registration OTP for', email, 'is:', otp);
    res.status(201).json({
      message: 'User created. OTP sent to email (console). Use /verify-otp with otp and sessionToken.',
      sessionToken,
      otp
    });
  } catch (err) {
    next(err);
  }
};

exports.verifyOtp = async (req, res, next) => {
  try {
    const { email, otp, sessionToken } = req.body;
    if (!email || !otp || !sessionToken) return res.status(400).json({ message: 'email, otp and sessionToken required' });
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User not found' });
    const session = await Session.findOne({ token: sessionToken, userId: user._id });
    if (!session) return res.status(400).json({ message: 'Invalid session token' });

    user.isEmailVerified = true;
    await user.save();

    const jwtToken = signToken(user);
    session.token = jwtToken;
    session.lastUsedAt = new Date();
    await session.save();

    res.json({ token: jwtToken, user: user });
  } catch (err) { next(err); }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    // Check if the user's email is verified
    if (!user.isEmailVerified) {
      return res.status(400).json({ message: 'User not verified. Please check your email for OTP.Pleas register again' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const jwtToken = signToken(user);
    const session = new Session({ userId: user._id, token: jwtToken, lastUsedAt: new Date() });
    await session.save();
    res.json({ token: jwtToken, user: user });
  } catch (err) {
    next(err);
  }
};

exports.logout = async (req, res, next) => {
  try {
    const token = (req.headers.authorization || '').split(' ')[1];
    if (token) await Session.deleteOne({ token });
    res.json({ message: 'Logged out' });
  } catch (err) { next(err); }
};
