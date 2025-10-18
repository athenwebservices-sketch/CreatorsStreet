const Order = require('../models/orderModel');
const Product = require('../models/productModel');
const Shipment = require('../models/shipmentModel');
const ReturnModel = require('../models/returnModel');
const sendMail = require('../config/mailConfig');
const QRCode = require('qrcode'); // Add this import

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
    
    if(status==='paid') {
      // Generate QR code for the order
      const qrCodeDataUrl = await QRCode.toDataURL(order._id, {
        width: 200,
        margin: 2,
        color: {
          dark: '#3c0052',
          light: '#FFFFFF'
        }
      });
      
      sendMail({
        to: req.user.email,
        subject: 'Order Payment Confirmation', 
        html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #3c0052;">Payment Confirmation</h2>
          <p>Thank you for your purchase.</p>
          <p>Your payment has been successfully processed. Please find your order details below:</p>
          
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Order Details</h3>
            <p><strong>Order ID:</strong> ${order.orderNumber}</p>
            <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
            <p><strong>Total Amount:</strong> ${order.currency} ${order.totalAmount}</p>
          </div>
          
          <div style="text-align: center; margin: 20px 0;">
            <h3>Your Order QR Code</h3>
            <p>Please save this QR code for your records. You may need to show it when collecting your order.</p>
            <img src="${qrCodeDataUrl}" alt="Order QR Code" style="max-width: 200px; margin: 10px auto; display: block;" />
          </div>
          
          <p style="font-size: 12px; color: #666; margin-top: 30px;">
            This is an automated message. Please do not reply to this email.
          </p>
        </div>`
      });
    }

    // NOTE: You might want to add business logic here to restrict
    // which statuses a customer can set (e.g., they can only set it to 'cancelled').
    // For now, this allows any status update for the owner or an admin.
    order.status = status;
    order.paymentStatus= req.body.paymentStatus || order.paymentStatus
    await order.save();

    // Return the updated order as a plain object
    res.json(order.toObject());
  } catch (e) {
    next(e);
  }
};

// In your orderController.js

exports.list = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page || '1'));
    const limit = Math.max(1, parseInt(req.query.limit || '20'));
    const skip = (page - 1) * limit;
    const search = req.query.search || '';

    // Always sort by 'createdAt' in descending order (most recent first)
    const sortOrder = -1;  // -1 for descending order

    // Base query: for customers, only their own orders. For admins, all orders.
    let query = req.user.role === 'customer' 
      ? { userId: req.user._id } 
      : {};

    // If a search term is provided, add it to the query
    if (search) {
      query.$or = [
        // Search by product name (case-insensitive)
        { 'items.productName': { $regex: search, $options: 'i' } },
        // Search by order number (case-insensitive)
        { orderNumber: { $regex: search, $options: 'i' } }
      ];

      // If the user is an admin, also search by user email
      if (req.user.role !== 'customer') {
        // This requires populating the userId first, or a separate query.
        // A more efficient way is to use a $lookup aggregation, but for simplicity,
        // we can add the email to the $or if it's already populated.
        // The simplest approach that works without complex aggregation is below:
        
        // Note: This part is slightly more complex as it requires joining data.
        // The previous answer had a good approach. Let's refine it slightly.
        // If you don't have a UserModel, you can omit the email search part.
        const User = require('../models/userModel'); // Ensure this path is correct
        const users = await User.find({ email: { $regex: search, $options: 'i' } }).select('_id');
        const userIds = users.map(user => user._id);
        
        // Add search by user ID to the $or clause
        query.$or.push({ userId: { $in: userIds } });
      }
    }
    
    const total = await Order.countDocuments(query);
    const ordersQuery = Order.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: sortOrder });
    
    // Only populate user data for admins
    if (req.user.role !== 'customer') {
      ordersQuery.populate('userId', 'firstName lastName email');
    }
    
    const orders = await ordersQuery;
    
    res.json({ page, limit, total, orders });
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