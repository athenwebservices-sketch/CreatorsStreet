const express=require('express'); const router=express.Router();
const upload = require('../utils/fileUtils');
const { requireApiKey, protect } = require('../middleware/authMiddleware');
router.post('/', requireApiKey, protect, upload.single('file'), async (req,res)=>{ if(!req.file) return res.status(400).json({message:'No file'}); res.json({ fileUrl: '/uploads/' + req.file.filename }); });
module.exports = router;
