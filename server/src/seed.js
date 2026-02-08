require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Product = require('./models/Product');
const Coupon = require('./models/Coupon');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/chrono-luxury';

const sampleProducts = [
  {
    name: 'Submariner Pro',
    model: 'CH-1001',
    description: 'A legendary dive watch with 300m water resistance. Ceramic bezel, luminescent markers, and a robust automatic movement.',
    price: 125000,
    category: 'Diver',
    stock: 10,
    featured: true,
    images: ['https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800&q=80'],
    specifications: {
      caseSize: '41mm',
      movement: 'Automatic',
      waterResistance: '300m',
      strapType: 'Oyster',
      dialColor: 'Black',
      caseMaterial: 'Stainless Steel',
    },
  },
  {
    name: 'Datejust Classic',
    model: 'CH-2002',
    description: 'Timeless elegance with date complication. Perfect for both boardroom and evening wear.',
    price: 185000,
    category: 'Classic',
    stock: 8,
    featured: true,
    images: ['https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?w=800&q=80'],
    specifications: {
      caseSize: '36mm',
      movement: 'Automatic',
      waterResistance: '100m',
      strapType: 'Jubilee',
      dialColor: 'Silver',
      caseMaterial: 'Stainless Steel',
    },
  },
  {
    name: 'Chronograph Sport',
    model: 'CH-3003',
    description: 'High-precision chronograph with tachymeter scale. Built for speed and style.',
    price: 225000,
    category: 'Sport',
    stock: 5,
    featured: true,
    images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80'],
    specifications: {
      caseSize: '42mm',
      movement: 'Chronograph',
      waterResistance: '100m',
      strapType: 'Leather',
      dialColor: 'Blue',
      caseMaterial: 'Stainless Steel',
    },
  },
  {
    name: 'Explorer Heritage',
    model: 'CH-4004',
    description: 'Inspired by exploration. Robust, readable, and ready for any adventure.',
    price: 165000,
    category: 'Sport',
    stock: 12,
    featured: false,
    images: ['https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=800&q=80'],
    specifications: {
      caseSize: '39mm',
      movement: 'Automatic',
      waterResistance: '100m',
      strapType: 'Oyster',
      dialColor: 'Black',
      caseMaterial: 'Stainless Steel',
    },
  },
];

async function seed() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB');

  const adminExists = await User.findOne({ email: 'admin@chronoluxury.com' });
  if (!adminExists) {
    await User.create({
      name: 'Admin',
      email: 'admin@chronoluxury.com',
      password: 'admin123',
      role: 'admin',
    });
    console.log('Admin user created: admin@chronoluxury.com / admin123');
  }

  const count = await Product.countDocuments();
  if (count === 0) {
    await Product.insertMany(sampleProducts);
    console.log('Sample products created');
  }

  const couponExists = await Coupon.findOne({ code: 'WELCOME10' });
  if (!couponExists) {
    await Coupon.create({
      code: 'WELCOME10',
      discountType: 'percentage',
      discountValue: 10,
      minOrderAmount: 50000,
      maxDiscount: 10000,
      validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      usageLimit: 100,
      active: true,
    });
    console.log('Coupon WELCOME10 created (10% off, min ₹50k, max ₹10k off)');
  }

  console.log('Seed complete');
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
