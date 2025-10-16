const Wishlist = require('../models/wishlistModel');
exports.list = async (req,res,next)=>{ try{ const w = await Wishlist.find({ userId: req.user._id }); res.json(w);}catch(e){next(e)} };
exports.add = async (req,res,next)=>{ try{ const exists = await Wishlist.findOne({ userId: req.user._id, productId: req.body.productId }); if(exists) return res.json(exists); const w = await Wishlist.create({ userId: req.user._id, productId: req.body.productId, addedAt: new Date() }); res.status(201).json(w);}catch(e){next(e)} };
exports.remove = async (req,res,next)=>{ try{ await Wishlist.deleteOne({ userId: req.user._id, productId: req.params.productId }); res.json({message:'removed'});}catch(e){next(e)} };
