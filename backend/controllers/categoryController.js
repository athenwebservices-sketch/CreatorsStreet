const Category = require('../models/categoryModel');
const Product = require('../models/productModel');
exports.create = async (req,res,next)=>{ try{ const c=await Category.create(req.body); res.status(201).json(c);}catch(e){next(e)} };
exports.list = async (req,res,next)=>{ try{ const cats=await Category.find(); res.json(cats);}catch(e){next(e)} };
exports.get = async (req,res,next)=>{ try{ const c=await Category.findById(req.params.id); if(!c) return res.status(404).end(); res.json(c);}catch(e){next(e)} };
exports.update = async (req,res,next)=>{ try{ const c=await Category.findByIdAndUpdate(req.params.id, req.body,{new:true}); res.json(c);}catch(e){next(e)} };
exports.delete = async (req,res,next)=>{ try{ await Category.findByIdAndDelete(req.params.id); res.json({message:'deleted'});}catch(e){next(e)} };
exports.products = async (req,res,next)=>{ try{ const products = await Product.find({ categories: req.params.id }); res.json(products);}catch(e){next(e)} };
