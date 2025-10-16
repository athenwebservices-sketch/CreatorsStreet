const express=require('express'); const router=express.Router();
const { requireApiKey, protect } = require('../middleware/authMiddleware');
const ctrl = require('../controllers/paymentController');
router.post('/', requireApiKey, protect, ctrl.createPayment);
router.get('/', requireApiKey, protect, ctrl.list);
router.get('/:id', requireApiKey, protect, ctrl.get);
router.put('/:id', requireApiKey, protect, ctrl.update);
router.delete('/:id', requireApiKey, protect, ctrl.delete);
module.exports = router;
