const Notification = require('../models/notificationModel');
const Template = require('../models/templateModel');
const Preference = require('../models/preferenceModel');

exports.listForUser = async (req,res,next)=>{ try{ const n = await Notification.find({ recipientId: req.user._id }).sort({ createdAt:-1 }); res.json(n);}catch(e){next(e)} };
exports.markRead = async (req,res,next)=>{ try{ await Notification.findByIdAndUpdate(req.params.id, { status:'read', readAt: new Date() }); res.json({message:'ok'});}catch(e){next(e)} };
exports.markAllRead = async (req,res,next)=>{ try{ await Notification.updateMany({ recipientId: req.user._id }, { status:'read', readAt: new Date() }); res.json({message:'ok'});}catch(e){next(e)} };
exports.delete = async (req,res,next)=>{ try{ await Notification.findByIdAndDelete(req.params.id); res.json({message:'deleted'});}catch(e){next(e)} };

// preferences
exports.getPreferences = async (req,res,next)=>{ try{ const p = await Preference.findOne({ userId: req.user._id }); res.json(p || {});}catch(e){next(e)} };
exports.updatePreferences = async (req,res,next)=>{ try{ const up = await Preference.findOneAndUpdate({ userId: req.user._id }, { preferences: req.body }, { upsert:true, new:true }); res.json(up);}catch(e){next(e)} };

// admin templates
exports.listTemplates = async (req,res,next)=>{ try{ const t = await Template.find(); res.json(t);}catch(e){next(e)} };
exports.createTemplate = async (req,res,next)=>{ try{ const t = await Template.create(req.body); res.status(201).json(t);}catch(e){next(e)} };
exports.getTemplate = async (req,res,next)=>{ try{ const t = await Template.findById(req.params.id); res.json(t);}catch(e){next(e)} };
exports.updateTemplate = async (req,res,next)=>{ try{ const t = await Template.findByIdAndUpdate(req.params.id, req.body, { new: true }); res.json(t);}catch(e){next(e)} };
exports.deleteTemplate = async (req,res,next)=>{ try{ await Template.findByIdAndDelete(req.params.id); res.json({message:'deleted'});}catch(e){next(e)} };
