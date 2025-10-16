const express = require('express');
const router = express.Router();
const { requireApiKey, protect, authorizeRoles } = require('../middleware/authMiddleware');
const ctrl = require('../controllers/adminGalleryController');

// Admin-facing CMS endpoints - require admin or superadmin
router.post('/galleries', requireApiKey, protect, authorizeRoles('admin','superadmin'), ctrl.createGallery);
router.get('/galleries', requireApiKey, protect, authorizeRoles('admin','superadmin'), ctrl.listAll);
router.get('/galleries/:id', requireApiKey, protect, authorizeRoles('admin','superadmin'), ctrl.getGallery);
router.put('/galleries/:id', requireApiKey, protect, authorizeRoles('admin','superadmin'), ctrl.updateGallery);
router.delete('/galleries/:id', requireApiKey, protect, authorizeRoles('superadmin'), ctrl.deleteGallery);

router.post('/galleries/:id/items', requireApiKey, protect, authorizeRoles('admin','superadmin'), ctrl.addItem);
router.put('/gallery-items/:itemId', requireApiKey, protect, authorizeRoles('admin','superadmin'), ctrl.updateItem);
router.put('/gallery-items/:itemId/approve', requireApiKey, protect, authorizeRoles('admin','superadmin'), ctrl.approveItem);
router.put('/gallery-items/:itemId/reject', requireApiKey, protect, authorizeRoles('admin','superadmin'), ctrl.rejectItem);
router.delete('/gallery-items/:itemId', requireApiKey, protect, authorizeRoles('admin','superadmin'), ctrl.deleteItem);

module.exports = router;
