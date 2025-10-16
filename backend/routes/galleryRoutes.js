const express = require('express');
const router = express.Router();
const { requireApiKey, protect } = require('../middleware/authMiddleware');
const ctrl = require('../controllers/galleryController');

// Public-facing endpoints (customers)
router.get('/', requireApiKey, ctrl.listActive);
router.get('/:slug', requireApiKey, ctrl.getBySlug);
router.get('/:slug/items', requireApiKey, ctrl.getItems);
// submit (requires auth to attach customerId) - protect enforces JWT session
router.post('/:slug/items', requireApiKey, protect, ctrl.submitItem);

module.exports = router;
