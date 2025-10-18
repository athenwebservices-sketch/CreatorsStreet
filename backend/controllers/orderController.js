const Order = require('../models/orderModel');
const Product = require('../models/productModel');
const Shipment = require('../models/shipmentModel');
const ReturnModel = require('../models/returnModel');

function generateOrderNumber(){ return 'ORD-' + Date.now() + '-' + Math.random().toString(36).substr(2,4).toUpperCase(); }

exports.createOrder = async (req,res,next)=>{
  try{
    const { items, shippingAddress, billingAddress, paymentMethod, currency } = req.body;
    if(!items || !items.length) return res.status(400).json({message:'No items'});
    let subtotal = 0; const orderItems = [];
    console.log(items)
    for(const it of items){
      console.log(it)
      const p = await Product.findById(it.productId);
      console.log(p);
      if(!p) return res.status(400).json({message:'Product not found'});
      const price = p.price; subtotal += price * (it.quantity||1);
      orderItems.push({ productId:p._id, variantId: it.variantId, productName:p.name, productImage:p.imageUrls && p.imageUrls[0] && p.imageUrls[0].url, quantity: it.quantity||1, price });
    }
    const tax = 0; const shipping = 0; const total = subtotal + tax + shipping;
    const order = await Order.create({ orderNumber: generateOrderNumber(), userId: req.user._id, items: orderItems, subtotal, taxAmount:tax, shippingCost:shipping, totalAmount:total, currency: currency||'USD', shippingAddress, billingAddress, paymentMethod, paymentStatus: 'pending' });
    res.status(201).json(order);
  }catch(e){next(e)}
};

exports.updateStatusByNumber = async (req, res, next) => {
  try {
    const { orderNumber } = req.params;
    if (!orderNumber) {
      return res.status(400).json({ message: 'Order number is required' });
    }

    // Find the order by its unique orderNumber
    const order = await Order.findOne({ orderNumber: orderNumber });

    if (!order) {
      return res.status(404).json({ message: 'Order not found with that number' });
    }

    // --- REVISED PERMISSION CHECK ---
    // If the user is a customer, ensure they own the order.
    // If the user is an admin (or other non-customer role), they are allowed.
    console.log(order.userId.toString())
    console.log(req.user._id.toString())
    if (req.user.role === 'customer' && order.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this order' });
    }

    // Update the status from the request body
    const { status } = req.body;
    if (!status) {
        return res.status(400).json({ message: 'Status is required in the request body' });
    }

    // NOTE: You might want to add business logic here to restrict
    // which statuses a customer can set (e.g., they can only set it to 'cancelled').
    // For now, this allows any status update for the owner or an admin.
    order.status = status;

    await order.save();

    // Return the updated order as a plain object
    res.json(order.toObject());
  } catch (e) {
    next(e);
  }
};

exports.list = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page || '1'));
    const limit = Math.max(1, parseInt(req.query.limit || '20'));
    const skip = (page - 1) * limit;

    // Always sort by 'createdAt' in descending order (most recent first)
    const sortOrder = -1;  // -1 for descending order

    if (req.user.role === 'customer') {
      const total = await Order.countDocuments({ userId: req.user._id });
      const orders = await Order.find({ userId: req.user._id })
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: sortOrder });  // Sort by createdAt, descending
      res.json({ page, limit, total, orders });
    } else {
      const total = await Order.countDocuments();
      const orders = await Order.find()
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: sortOrder })  // Sort by createdAt, descending
        .populate('userId', 'firstName lastName email');
      res.json({ page, limit, total, orders });
    }
  } catch (e) {
    next(e);
  }
};


exports.get = async (req,res,next)=>{
  try{ const order = await Order.findById(req.params.id); if(!order) return res.status(404).end(); if(req.user.role==='customer' && order.userId.toString()!==req.user._id.toString()) return res.status(403).end(); res.json(order);}catch(e){next(e)}
};

exports.cancel = async (req,res,next)=>{
  try{ const order = await Order.findById(req.params.id); if(!order) return res.status(404).end(); if(req.user.role==='customer' && order.userId.toString()!==req.user._id.toString()) return res.status(403).end(); order.status='cancelled'; await order.save(); res.json(order);}catch(e){next(e)}
};

exports.updateStatus = async (req,res,next)=>{
  try{ const order = await Order.findById(req.params.id); if(!order) return res.status(404).end(); if(req.user.role==='customer') return res.status(403).end(); order.status = req.body.status; await order.save(); res.json(order);}catch(e){next(e)}
};

exports.createShipment = async (req,res,next)=>{
  try{ const order = await Order.findById(req.params.id); if(!order) return res.status(404).end(); if(req.user.role==='customer') return res.status(403).end(); const s = await Shipment.create({ orderId: order._id, ...req.body }); res.status(201).json(s);}catch(e){next(e)}
};

exports.updateShipment = async (req,res,next)=>{
  try{ const s = await Shipment.findByIdAndUpdate(req.params.shipmentId, req.body, { new: true }); res.json(s);}catch(e){next(e)}
};

// returns
exports.createReturn = async (req,res,next)=>{
  try{ const r = await ReturnModel.create({ orderId: req.params.id, userId: req.user._id, ...req.body }); res.status(201).json(r);}catch(e){next(e)}
};
exports.listReturns = async (req,res,next)=>{
  try{ const list = await ReturnModel.find({ orderId: req.params.id }); res.json(list);}catch(e){next(e)}
};
exports.approveReturn = async (req,res,next)=>{ try{ const r = await ReturnModel.findById(req.params.returnId); r.status='approved'; await r.save(); res.json(r);}catch(e){next(e)} };
exports.rejectReturn = async (req,res,next)=>{ try{ const r = await ReturnModel.findById(req.params.returnId); r.status='rejected'; await r.save(); res.json(r);}catch(e){next(e)} };
exports.markReceived = async (req,res,next)=>{ try{ const r = await ReturnModel.findById(req.params.returnId); r.status='received'; await r.save(); res.json(r);}catch(e){next(e)} };