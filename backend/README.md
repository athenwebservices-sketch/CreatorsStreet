Enterprise Backend Complete

Run:
1. cd backend_enterprise_complete
2. npm install
3. Edit .env (Mongo URI, API_KEY, JWT secret)
4. npm run dev

Security notes:
- All requests require header x-api-key: enterprisemediumtoken12345 (or change .env)
- After login/verify you'll receive a JWT. Protected routes require Authorization: Bearer <token>
- Sessions are tracked server-side to implement sliding 1-hour inactivity expiry.

Main folders:
- models: Mongoose models
- controllers: route handlers
- routes: Express routes
- middleware: auth/error
- utils: multer file uploader

This package is intentionally self-contained and uses local filesystem for uploads and console for OTP/password reset tokens. Replace these with real email/payment providers for production.
