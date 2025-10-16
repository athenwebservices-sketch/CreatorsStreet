const Gallery = require('../models/galleryModel');
const GalleryItem = require('../models/galleryItemModel');

// List active galleries with optional pagination
exports.listActive = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page || '1'));
    const limit = Math.max(1, parseInt(req.query.limit || '20'));
    const skip = (page-1)*limit;
    const filter = { isActive: true };
    if (req.query.tag) filter.tags = req.query.tag;
    const total = await Gallery.countDocuments(filter);
    const galleries = await Gallery.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 });
    res.json({ page, limit, total, galleries });
  } catch (err) { next(err); }
};

// Get gallery by slug and its approved items (paged)
exports.getBySlug = async (req, res, next) => {
  try {
    const slug = req.params.slug;
    const gallery = await Gallery.findOne({ slug });
    if (!gallery) return res.status(404).json({ message: 'Gallery not found' });
    const items = await GalleryItem.find({ galleryId: gallery._id, isApproved: true }).sort({ sortOrder: 1, createdAt: -1 });
    res.json({ gallery, items });
  } catch (err) { next(err); }
};

// Get items for gallery (for infinite scroll) - only approved items for public
exports.getItems = async (req, res, next) => {
  try {
    const slug = req.params.slug;
    const gallery = await Gallery.findOne({ slug });
    if (!gallery) return res.status(404).json({ message: 'Gallery not found' });
    const page = Math.max(1, parseInt(req.query.page || '1'));
    const limit = Math.max(1, parseInt(req.query.limit || '24'));
    const skip = (page-1)*limit;
    const items = await GalleryItem.find({ galleryId: gallery._id, isApproved: true })
      .sort({ sortOrder: 1, createdAt: -1 })
      .skip(skip).limit(limit);
    const total = await GalleryItem.countDocuments({ galleryId: gallery._id, isApproved: true });
    res.json({ page, limit, total, items });
  } catch (err) { next(err); }
};

// Public: allow logged-in user to submit an item to a gallery (not auto-approved)
exports.submitItem = async (req, res, next) => {
  try {
    const slug = req.params.slug;
    const gallery = await Gallery.findOne({ slug });
    if (!gallery) return res.status(404).json({ message: 'Gallery not found' });
    const { mediaUrl, mediaType, thumbnailUrl, caption, altText, linkedProductId, linkedVariantId } = req.body;
    // require mediaUrl and mediaType
    if (!mediaUrl || !mediaType) return res.status(400).json({ message: 'mediaUrl and mediaType are required' });
    const item = await GalleryItem.create({
      galleryId: gallery._id,
      mediaUrl, mediaType, thumbnailUrl, caption, altText,
      source: 'customer',
      customerId: req.user ? req.user._id : undefined,
      linkedProductId, linkedVariantId,
      isApproved: false, // needs moderation
      sortOrder: 0
    });
    res.status(201).json({ message: 'Submitted for review', item });
  } catch (err) { next(err); }
};
