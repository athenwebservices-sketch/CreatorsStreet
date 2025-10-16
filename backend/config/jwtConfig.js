module.exports = {
  secret: process.env.JWT_SECRET || 'changeme',
  expiresIn: process.env.JWT_EXPIRES_IN || '1h',
  apiKey: process.env.API_KEY || 'changeme-api-key'
};
