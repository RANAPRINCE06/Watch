const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name: String,
  price: Number,
  quantity: { type: Number, required: true, min: 1 },
  image: String,
});

const orderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    products: [orderItemSchema],
    totalAmount: { type: Number, required: true },
    subtotal: Number,
    gst: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    couponCode: String,
    paymentStatus: { type: String, enum: ['pending', 'paid', 'failed', 'refunded'], default: 'pending' },
    paymentMethod: { type: String, enum: ['razorpay', 'stripe', 'cod'], default: 'razorpay' },
    razorpayOrderId: String,
    razorpayPaymentId: String,
    stripePaymentIntentId: String,
    orderStatus: { type: String, enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'], default: 'pending' },
    shippingDetails: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      email: { type: String, required: true },
      address: { type: String, required: true },
      pincode: { type: String, required: true },
      city: String,
      state: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
