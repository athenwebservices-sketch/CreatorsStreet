const Gallery = require('../models/galleryModel');
const GalleryItem = require('../models/galleryItemModel');

// Create gallery
exports.createGallery = async (req, res, next) => {
  try {
    const data = req.body;
    const g = await Gallery.create({ ...data, createdAt: new Date(), updatedAt: new Date() });
    res.status(201).json(g);
  } catch (err) { next(err); }
};

// List all galleries (including inactive)
exports.listAll = async (req, res, next) => {
  try {
    const galleries = await Gallery.find().sort({ createdAt: -1 });
    res.json(galleries);
  } catch (err) { next(err); }
};

// Get gallery by id
exports.getGallery = async (req, res, next) => {
  try {
    const g = await Gallery.findById(req.params.id);
    if (!g) return res.status(404).json({ message: 'Gallery not found' });
    res.json(g);
  } catch (err) { next(err); }
};

// Update gallery
exports.updateGallery = async (req, res, next) => {
  try {
    const updates = req.body;
    updates.updatedAt = new Date();
    const g = await Gallery.findByIdAndUpdate(req.params.id, updates, { new: true });
    res.json(g);
  } catch (err) { next(err); }
};

// Delete gallery and its items
exports.deleteGallery = async (req, res, next) => {
  try {
    const id = req.params.id;
    await GalleryItem.deleteMany({ galleryId: id });
    await Gallery.findByIdAndDelete(id);
    res.json({ message: 'Gallery and its items deleted' });
  } catch (err) { next(err); }
};

// Admin add item to gallery (auto-approved if source=admin)
exports.addItem = async (req, res, next) => {
  try {
    const galleryId = req.params.id;
    const { mediaUrl, mediaType, thumbnailUrl, caption, altText, linkedProductId, linkedVariantId, sortOrder } = req.body;
    if (!mediaUrl || !mediaType) return res.status(400).json({ message: 'mediaUrl and mediaType are required' });
    const item = await GalleryItem.create({
      galleryId,
      mediaUrl, mediaType, thumbnailUrl, caption, altText,
      source: 'admin',
      linkedProductId, linkedVariantId, sortOrder: sortOrder || 0, isApproved: true
    });
    res.status(201).json(item);
  } catch (err) { next(err); }
};

// Update gallery item (caption, sortOrder, linked product, etc.)
exports.updateItem = async (req, res, next) => {
  try {
    const itemId = req.params.itemId;
    const updates = req.body;
    const item = await GalleryItem.findByIdAndUpdate(itemId, updates, { new: true });
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json(item);
  } catch (err) { next(err); }
};

// Approve an item (set isApproved = true)
exports.approveItem = async (req, res, next) => {
  try {
    const itemId = req.params.itemId;
    const item = await GalleryItem.findById(itemId);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    item.isApproved = true;
    await item.save();
    res.json({ message: 'Item approved', item });
  } catch (err) { next(err); }
};

// Reject (delete) a user-submitted item
exports.rejectItem = async (req, res, next) => {
  try {
    const itemId = req.params.itemId;
    const item = await GalleryItem.findById(itemId);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    // optionally check source === 'customer' before deleting
    await item.deleteOne();
    res.json({ message: 'Item rejected and deleted' });
  } catch (err) { next(err); }
};

// Delete item
exports.deleteItem = async (req, res, next) => {
  try {
    const itemId = req.params.itemId;
    await GalleryItem.findByIdAndDelete(itemId);
    res.json({ message: 'Item deleted' });
  } catch (err) { next(err); }
};
