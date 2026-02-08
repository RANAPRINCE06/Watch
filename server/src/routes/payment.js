const express = require('express');
const crypto = require('crypto');
const Order = require('../models/Order');
const Product = require('../models/Product');
const { protect } = require('../middleware/auth');

const router = express.Router();

let Razorpay, Stripe;
try {
  Razorpay = require('razorpay');
  Stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
} catch (e) {}

const razorpayInstance = process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET
  ? new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_KEY_SECRET })
  : null;

router.post('/create-order', protect, async (req, res) => {
  try {
    const { orderId, paymentMethod } = req.body;
    const order = await Order.findOne({ _id: orderId, userId: req.user.id });
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    if (order.paymentStatus === 'paid') return res.status(400).json({ success: false, message: 'Already paid' });

    const amountInPaise = Math.round(order.totalAmount * 100);

    if (paymentMethod === 'stripe' && Stripe) {
      const paymentIntent = await Stripe.paymentIntents.create({
        amount: amountInPaise,
        currency: 'inr',
        metadata: { orderId: order._id.toString() },
      });
      order.stripePaymentIntentId = paymentIntent.id;
      await order.save();
      return res.json({
        success: true,
        clientSecret: paymentIntent.client_secret,
        orderId: order._id,
      });
    }

    if (razorpayInstance) {
      const options = {
        amount: amountInPaise,
        currency: 'INR',
        receipt: order._id.toString(),
      };
      const razorpayOrder = await razorpayInstance.orders.create(options);
      order.razorpayOrderId = razorpayOrder.id;
      await order.save();
      return res.json({
        success: true,
        orderId: order._id,
        razorpayOrderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        key: process.env.RAZORPAY_KEY_ID,
      });
    }

    res.status(400).json({ success: false, message: 'Payment not configured' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/verify-razorpay', protect, async (req, res) => {
  try {
    const { orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const order = await Order.findOne({ _id: orderId, userId: req.user.id });
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    const sign = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + '|' + razorpay_payment_id)
      .digest('hex');

    if (sign !== razorpay_signature)
      return res.status(400).json({ success: false, message: 'Invalid signature' });

    order.paymentStatus = 'paid';
    order.razorpayPaymentId = razorpay_payment_id;
    order.orderStatus = 'confirmed';
    for (const item of order.products) {
      await Product.updateOne({ _id: item.product }, { $inc: { stock: -item.quantity } });
    }
    await order.save();

    const sendEmail = require('../utils/email');
    if (sendEmail && order.shippingDetails?.email) {
      await sendEmail({
        to: order.shippingDetails.email,
        subject: `Order Confirmed #${order._id}`,
        html: `Your order ${order._id} has been confirmed. Total: ₹${order.totalAmount}`,
      }).catch(() => {});
    }

    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/verify-stripe', protect, async (req, res) => {
  try {
    const { orderId, paymentIntentId } = req.body;
    const order = await Order.findOne({ _id: orderId, userId: req.user.id });
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    if (Stripe) {
      const paymentIntent = await Stripe.paymentIntents.retrieve(paymentIntentId);
      if (paymentIntent.status !== 'succeeded')
        return res.status(400).json({ success: false, message: 'Payment not completed' });
    }

    order.paymentStatus = 'paid';
    order.orderStatus = 'confirmed';
    for (const item of order.products) {
      await Product.updateOne({ _id: item.product }, { $inc: { stock: -item.quantity } });
    }
    await order.save();

    const sendEmail = require('../utils/email');
    if (sendEmail && order.shippingDetails?.email) {
      await sendEmail({
        to: order.shippingDetails.email,
        subject: `Order Confirmed #${order._id}`,
        html: `Your order ${order._id} has been confirmed. Total: ₹${order.totalAmount}`,
      }).catch(() => {});
    }

    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Razorpay webhook: mount this route with express.raw({ type: 'application/json' }) before express.json() in main app if needed
router.post('/razorpay-webhook', (req, res) => {
  const body = req.body;
  const sig = req.headers['x-razorpay-signature'];
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!webhookSecret) return res.status(200).send('ok');

  const expected = crypto
    .createHmac('sha256', webhookSecret)
    .update(JSON.stringify(body))
    .digest('hex');
  if (expected !== sig) return res.status(400).send('Invalid signature');

  const event = body.event;
  if (event === 'payment.captured') {
    const payment = body.payload.payment?.entity;
    Order.findOneAndUpdate(
      { razorpayOrderId: payment?.order_id },
      { paymentStatus: 'paid', razorpayPaymentId: payment?.id, orderStatus: 'confirmed' }
    ).then(() => {});
  }
  res.status(200).send('ok');
});

module.exports = router;
