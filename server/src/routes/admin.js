const express = require('express');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Coupon = require('../models/Coupon');
const { protect, admin } = require('../middleware/auth');
const { upload } = require('../middleware/upload');
const { uploadToCloudinary } = require('../utils/cloudinary');

const router = express.Router();
router.use(protect, admin);

router.get('/orders', async (req, res) => {
  try {
    const orders = await Order.find().sort('-createdAt').populate('userId', 'name email').lean();
    res.json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.patch('/orders/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { orderStatus: status },
      { new: true }
    );
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/products', async (req, res) => {
  try {
    const products = await Product.find().sort('-createdAt').lean();
    res.json({ success: true, products });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/products', upload.array('images', 5), async (req, res) => {
  try {
    const data = req.body;
    const images = [];
    if (req.files?.length && uploadToCloudinary) {
      for (const file of req.files) {
        const result = await uploadToCloudinary(file.buffer, 'watches');
        if (result?.secure_url) images.push(result.secure_url);
      }
    }
    if (data.images) {
      const urls = Array.isArray(data.images) ? data.images : data.images.split(',').map((s) => s.trim());
      images.push(...urls.filter(Boolean));
    }
    const product = await Product.create({
      name: data.name,
      model: data.model,
      description: data.description,
      price: Number(data.price),
      category: data.category,
      stock: Number(data.stock) || 0,
      featured: data.featured === 'true',
      images,
      specifications: {
        caseSize: data.caseSize,
        movement: data.movement,
        waterResistance: data.waterResistance,
        strapType: data.strapType,
        dialColor: data.dialColor,
        caseMaterial: data.caseMaterial,
      },
    });
    res.status(201).json({ success: true, product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.put('/products/:id', upload.array('images', 5), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    const data = req.body;
    const images = [...(product.images || [])];
    if (req.files?.length && uploadToCloudinary) {
      for (const file of req.files) {
        const result = await uploadToCloudinary(file.buffer, 'watches');
        if (result?.secure_url) images.push(result.secure_url);
      }
    }
    if (data.newImages) {
      const urls = Array.isArray(data.newImages) ? data.newImages : data.newImages.split(',').map((s) => s.trim());
      images.push(...urls.filter(Boolean));
    }

    product.name = data.name ?? product.name;
    product.model = data.model ?? product.model;
    product.description = data.description ?? product.description;
    product.price = data.price !== undefined ? Number(data.price) : product.price;
    product.category = data.category ?? product.category;
    product.stock = data.stock !== undefined ? Number(data.stock) : product.stock;
    product.featured = data.featured !== undefined ? data.featured === 'true' : product.featured;
    product.images = images.length ? images : product.images;
    product.specifications = {
      caseSize: data.caseSize ?? product.specifications?.caseSize,
      movement: data.movement ?? product.specifications?.movement,
      waterResistance: data.waterResistance ?? product.specifications?.waterResistance,
      strapType: data.strapType ?? product.specifications?.strapType,
      dialColor: data.dialColor ?? product.specifications?.dialColor,
      caseMaterial: data.caseMaterial ?? product.specifications?.caseMaterial,
    };
    await product.save();
    res.json({ success: true, product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.delete('/products/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/coupons', async (req, res) => {
  try {
    const coupons = await Coupon.find().sort('-createdAt').lean();
    res.json({ success: true, coupons });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/coupons', async (req, res) => {
  try {
    const coupon = await Coupon.create(req.body);
    res.status(201).json({ success: true, coupon });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
