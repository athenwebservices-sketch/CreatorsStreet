const Product = require('../models/productModel');
const Variant = require('../models/variantModel');
const Review = require('../models/reviewModel');
const View = require('../models/viewModel');

exports.createProduct = async (req,res,next)=>{
  try{ const p=await Product.create({ ...req.body, createdBy: req.user._id, createdAt: new Date() }); res.status(201).json(p);}catch(e){next(e)}
};

exports.list = async (req,res,next)=>{
  try{
    const page = Math.max(1, parseInt(req.query.page||'1'));
    const limit = Math.max(1, parseInt(req.query.limit||'20'));
    const skip = (page-1)*limit;
    const total = await Product.countDocuments();
    const products = await Product.find().skip(skip).limit(limit).populate('categories').exec();
    res.json({ page, limit, total, products });
  }catch(e){next(e)}
};

exports.get = async (req,res,next)=>{ try{ const p=await Product.findById(req.params.id).populate('categories variants'); if(!p) return res.status(404).end(); res.json(p);}catch(e){next(e)} };

exports.update = async (req,res,next)=>{ try{ const p=await Product.findById(req.params.id); if(!p) return res.status(404).end(); if(req.user.role==='customer' && p.createdBy.toString()!==req.user._id.toString()) return res.status(403).end(); Object.assign(p, req.body); if(req.body.price) p.priceHistory.push({price:req.body.price}); await p.save(); res.json(p);}catch(e){next(e)} };

exports.delete = async (req,res,next)=>{ try{ const p=await Product.findById(req.params.id); if(!p) return res.status(404).end(); if(req.user.role==='customer' && p.createdBy.toString()!==req.user._id.toString()) return res.status(403).end(); await p.deleteOne(); res.json({message:'deleted'});}catch(e){next(e)} };

exports.search = async (req,res,next)=>{ try{ const q=req.query.q||''; const products=await Product.find(q?{ $text: { $search: q } } : {}).limit(50); res.json(products);}catch(e){next(e)} };
exports.featured = async (req,res,next)=>{ try{ const products=await Product.find({ featured: true }).limit(50); res.json(products);}catch(e){next(e)} };

// inventory endpoints
exports.getInventory = async (req,res,next)=>{ try{ const p=await Product.findById(req.params.id); if(!p) return res.status(404).end(); res.json({stock:p.stock}); }catch(e){next(e)} };
exports.updateInventory = async (req,res,next)=>{ try{ const p=await Product.findById(req.params.id); if(!p) return res.status(404).end(); p.stock = req.body.stock; await p.save(); res.json({stock:p.stock}); }catch(e){next(e)} };

// variants
exports.addVariant = async (req,res,next)=>{ try{ const v = await Variant.create({ product: req.params.id, ...req.body }); await Product.findByIdAndUpdate(req.params.id, { $push: { variants: v._id }}); res.status(201).json(v);}catch(e){next(e)} };
exports.getVariants = async (req,res,next)=>{ try{ const vars = await Variant.find({ product: req.params.id }); res.json(vars);}catch(e){next(e)} };
exports.updateVariant = async (req,res,next)=>{ try{ const v = await Variant.findByIdAndUpdate(req.params.variantId, req.body, { new: true }); res.json(v);}catch(e){next(e)} };
exports.deleteVariant = async (req,res,next)=>{ try{ await Variant.findByIdAndDelete(req.params.variantId); res.json({message:'deleted'});}catch(e){next(e)} };

// reviews
exports.addReview = async (req,res,next)=>{ try{ const r = await Review.create({ product:req.params.id, user:req.user._id, ...req.body }); const p = await Product.findById(req.params.id); p.reviewsCount = await Review.countDocuments({product:p._id}); const avg = await Review.aggregate([{ $match:{product:p._id} }, { $group:{ _id:null, avg:{ $avg:'$rating' }}}]); p.rating = avg[0]? avg[0].avg : 0; await p.save(); res.status(201).json(r);}catch(e){next(e)} };
exports.getReviews = async (req,res,next)=>{ try{ const r = await Review.find({ product: req.params.id }).populate('user','firstName lastName'); res.json(r);}catch(e){next(e)} };
exports.updateReview = async (req,res,next)=>{ try{ const review = await Review.findById(req.params.reviewId); if(!review) return res.status(404).end(); if(review.user.toString()!==req.user._id.toString() && req.user.role==='customer') return res.status(403).end(); Object.assign(review, req.body); await review.save(); res.json(review);}catch(e){next(e)} };
exports.deleteReview = async (req,res,next)=>{ try{ const review = await Review.findById(req.params.reviewId); if(!review) return res.status(404).end(); if(review.user.toString()!==req.user._id.toString() && req.user.role==='customer') return res.status(403).end(); await review.deleteOne(); res.json({message:'deleted'});}catch(e){next(e)} };

// analytics & views
exports.trackView = async (req,res,next)=>{ try{ await View.create({ product: req.params.id, user: req.user? req.user._id : null }); res.json({message:'tracked'});}catch(e){next(e)} };
exports.popular = async (req,res,next)=>{ try{ const agg = await View.aggregate([{ $group:{ _id:'$product', views:{ $sum:1 }}},{ $sort:{ views:-1 }},{ $limit:20 }]); res.json(agg);}catch(e){next(e)} };
