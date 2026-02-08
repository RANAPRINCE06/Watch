const express = require('express');
const Order = require('../models/Order');
const Product = require('../models/Product');
const Coupon = require('../models/Coupon');
const { protect } = require('../middleware/auth');
const { generateInvoicePDF } = require('../utils/invoice');

const router = express.Router();

const GST_RATE = 0.18;

router.post('/validate-coupon', async (req, res) => {
  try {
    const { code, subtotal } = req.body;
    const coupon = await Coupon.findOne({ code: code?.toUpperCase(), active: true });
    if (!coupon) return res.json({ success: false, message: 'Invalid coupon' });
    if (new Date() > coupon.validUntil) return res.json({ success: false, message: 'Coupon expired' });
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit)
      return res.json({ success: false, message: 'Coupon limit reached' });
    if (subtotal < coupon.minOrderAmount)
      return res.json({ success: false, message: `Min order ₹${coupon.minOrderAmount}` });

    let discount = 0;
    if (coupon.discountType === 'percentage') {
      discount = (subtotal * coupon.discountValue) / 100;
      if (coupon.maxDiscount) discount = Math.min(discount, coupon.maxDiscount);
    } else discount = coupon.discountValue;

    res.json({
      success: true,
      discount: Math.round(discount),
      couponCode: coupon.code,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/', protect, async (req, res) => {
  try {
    const { products: cartItems, shippingDetails, couponCode, paymentMethod } = req.body;
    if (!cartItems?.length || !shippingDetails)
      return res.status(400).json({ success: false, message: 'Cart and shipping required' });

    let subtotal = 0;
    const orderProducts = [];
    for (const item of cartItems) {
      const product = await Product.findById(item.product).lean();
      if (!product) continue;
      if (product.stock < (item.quantity || 1))
        return res.status(400).json({ success: false, message: `Insufficient stock for ${product.name}` });
      const price = product.price;
      const qty = item.quantity || 1;
      subtotal += price * qty;
      orderProducts.push({
        product: product._id,
        name: product.name,
        price,
        quantity: qty,
        image: product.images?.[0],
      });
    }

    let discount = 0;
    if (couponCode) {
      const coupon = await Coupon.findOne({ code: couponCode.toUpperCase(), active: true });
      if (coupon && new Date() <= coupon.validUntil) {
        if (coupon.discountType === 'percentage') {
          discount = (subtotal * coupon.discountValue) / 100;
          if (coupon.maxDiscount) discount = Math.min(discount, coupon.maxDiscount);
        } else discount = coupon.discountValue;
        await Coupon.updateOne({ _id: coupon._id }, { $inc: { usedCount: 1 } });
      }
    }

    const afterDiscount = subtotal - discount;
    const gst = Math.round(afterDiscount * GST_RATE);
    const totalAmount = afterDiscount + gst;

    const order = await Order.create({
      userId: req.user.id,
      products: orderProducts,
      subtotal,
      gst,
      discount,
      couponCode: couponCode || undefined,
      totalAmount,
      paymentStatus: 'pending',
      paymentMethod: paymentMethod || 'razorpay',
      orderStatus: 'pending',
      shippingDetails,
    });

    res.status(201).json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/', protect, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id })
      .sort('-createdAt')
      .populate('products.product')
      .lean();
    res.json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, userId: req.user.id })
      .populate('products.product')
      .lean();
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.patch('/:id/cancel', protect, async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, userId: req.user.id });
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    if (order.orderStatus !== 'pending' && order.orderStatus !== 'confirmed')
      return res.status(400).json({ success: false, message: 'Cannot cancel this order' });
    order.orderStatus = 'cancelled';
    await order.save();
    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/:id/invoice', protect, async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, userId: req.user.id }).lean();
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    const pdf = await generateInvoicePDF(order);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=invoice-${order._id}.pdf`);
    res.send(pdf);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
