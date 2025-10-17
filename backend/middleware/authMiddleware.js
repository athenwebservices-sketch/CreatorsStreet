const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwtConfig');
const User = require('../models/userModel');
const Session = require('../models/sessionModel');

exports.requireApiKey = (req, res, next) => {
  const key = req.headers['x-api-key'] || req.query.api_key;
  if (!key || key !== jwtConfig.apiKey) {
    return res.status(401).json({ message: 'Invalid or missing API key' });
  }
  next();
};

exports.protect = async (req, res, next) => {
  try {
    let token = null;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    if (!token) return res.status(401).json({ message: 'Not authorized, token missing' });

    const decoded = jwt.verify(token, jwtConfig.secret);
    const user = await User.findById(decoded.id);
    console.log(user)
    if (!user) return res.status(401).json({ message: 'Not authorized' });

    // server-side session sliding expiry: 1 hour since last used
    const session = await Session.findOne({ token });
    if (!session) return res.status(401).json({ message: 'Session not found' });
    const oneHour = 1000 * 60 * 60;
    if (Date.now() - new Date(session.lastUsedAt || session.createdAt).getTime() > oneHour) {
      await session.deleteOne();
      return res.status(401).json({ message: 'Session expired' });
    }
    // update lastUsedAt to now
    session.lastUsedAt = new Date();
    await session.save();

    req.user = user;
    req.session = session;
    next();
  } catch (err) {
    console.error(err);
    return res.status(401).json({ message: 'Token invalid or expired' });
  }
};

exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: 'Not authenticated' });
    if (!roles.includes(req.user.role)) return res.status(403).json({ message: 'Forbidden: insufficient role' });
    next();
  };
};
