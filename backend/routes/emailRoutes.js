const express=require('express'); const router=express.Router();
const { requireApiKey, protect, authorizeRoles } = require('../middleware/authMiddleware');
const ctrl = require('../controllers/emailController');
router.post('/', requireApiKey, protect, ctrl.sendEmail);

module.exports = router;
