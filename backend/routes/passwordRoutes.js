const express=require('express'); const router=express.Router();
const ctrl = require('../controllers/passwordController');
router.post('/forgot-password', ctrl.forgot);
router.post('/reset-password', ctrl.reset);
module.exports = router;
