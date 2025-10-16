const express=require('express'); const router=express.Router();
const { requireApiKey, protect } = require('../middleware/authMiddleware');
const ctrl = require('../controllers/wishlistController');
router.get('/', requireApiKey, protect, ctrl.list);
router.post('/', requireApiKey, protect, ctrl.add);
router.delete('/:productId', requireApiKey, protect, ctrl.remove);
module.exports = router;
