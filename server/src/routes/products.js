const express = require('express');
const Product = require('../models/Product');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      sort = '-createdAt',
      category,
      minPrice,
      maxPrice,
      model,
      strapType,
      dialColor,
      featured,
    } = req.query;

    const filter = {};
    if (category) filter.category = new RegExp(category, 'i');
    if (model) filter.model = new RegExp(model, 'i');
    if (strapType) filter['specifications.strapType'] = new RegExp(strapType, 'i');
    if (dialColor) filter['specifications.dialColor'] = new RegExp(dialColor, 'i');
    if (featured === 'true') filter.featured = true;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    const skip = (Number(page) - 1) * Number(limit);
    const products = await Product.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(Number(limit))
      .lean();
    const total = await Product.countDocuments(filter);

    res.json({
      success: true,
      products,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/featured', async (req, res) => {
  try {
    const products = await Product.find({ featured: true }).limit(8).lean();
    res.json({ success: true, products });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/categories', async (req, res) => {
  try {
    const categories = await Product.distinct('category');
    res.json({ success: true, categories });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/filters', async (req, res) => {
  try {
    const [models, strapTypes, dialColors] = await Promise.all([
      Product.distinct('model'),
      Product.distinct('specifications.strapType'),
      Product.distinct('specifications.dialColor'),
    ]);
    res.json({ success: true, models, strapTypes, dialColors: dialColors.filter(Boolean) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).lean();
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    const related = await Product.find({
      _id: { $ne: product._id },
      $or: [{ category: product.category }, { model: product.model }],
    })
      .limit(4)
      .lean();

    res.json({ success: true, product, related });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
