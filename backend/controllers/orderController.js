const Order = require('../models/orderModel');
const Product = require('../models/productModel');
const Shipment = require('../models/shipmentModel');
const ReturnModel = require('../models/returnModel');
const sendMail = require('../config/mailConfig');
const QRCode = require('qrcode');
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

    const order = await Order.findOne({ orderNumber: orderNumber });
    if (!order) {
      return res.status(404).json({ message: 'Order not found with that number' });
    }

    if (req.user.role === 'customer' && order.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this order' });
    }

    const { status } = req.body;
    if (!status) {
        return res.status(400).json({ message: 'Status is required in the request body' });
    }
    
    order.status = status;
    await order.save();

    // --- QR CODE GENERATION ---
    const EmailOrderID = order._id.toString();
    const qrCodeDataURL = await QRCode.toDataURL(EmailOrderID);

    // 3. Create HTML content for the email with QR code embedded
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <h2 style="color: #3c0052; text-align: center;">Order Status Update</h2>
        <p>Hello ${req.user.name || 'there'},</p>
        <p>Your order <strong>#${order.orderNumber}</strong> has been successfully updated.</p>
        <p>The new status is: <strong>${order.status}</strong>.</p>
        
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Order Details</h3>
          <p><strong>Order ID:</strong> ${order._id}</p>
          <p><strong>Order Number:</strong> ${order.orderNumber}</p>
          <p><strong>Amount Paid:</strong> ₹${order.totalPrice ? order.totalPrice.toLocaleString() : 'N/A'}</p>
          <p><strong>Update Date:</strong> ${new Date().toLocaleDateString()}</p>
        </div>
        
        <div style="text-align: center; margin: 20px 0;">
          <h3>Your Order QR Code</h3>
          <p>Please save this QR code for your records. You may need to show it when collecting your order.</p>
          <img src="${qrCodeDataURL}" alt="Order QR Code" style="max-width: 200px; margin: 10px auto; display: block; border: 1px solid #ddd;" />
        </div>
        
        <p style="font-size: 12px; color: #666; margin-top: 30px; text-align: center;">
          This is an automated message. Please do not reply to this email.
        </p>
      </div>
    `;

    // --- SEND EMAIL AND FORGET ---
    // Remove 'await' to not block the response.
    // Add a .catch() to handle potential errors without crashing the app.
    sendMail({
      to: req.user.email,
      subject: `Order Status Updated - #${order.orderNumber}`,
      html: emailHtml,
    }).catch(err => {
      console.error('Failed to send order update email:', err);
      // Optionally, you could implement a more robust retry or notification system here.
    });

    // Respond to the client immediately after triggering the email
    res.json(order.toObject());

  } catch (e) {
    next(e);
  }
};
exports.list = async (req,res,next)=>{
  try{
    const page = Math.max(1, parseInt(req.query.page||'1'));
    const limit = Math.max(1, parseInt(req.query.limit||'20'));
    const skip = (page-1)*limit;
    if(req.user.role==='customer'){
      const total = await Order.countDocuments({ userId: req.user._id });
      const orders = await Order.find({ userId: req.user._id }).skip(skip).limit(limit);
      res.json({ page, limit, total, orders });
    } else {
      const total = await Order.countDocuments();
      const orders = await Order.find().skip(skip).limit(limit).populate('userId','firstName lastName email');
      res.json({ page, limit, total, orders });
    }
  }catch(e){next(e)}
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
