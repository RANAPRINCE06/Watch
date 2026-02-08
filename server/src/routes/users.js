const express = require('express');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/wishlist', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('wishlist').lean();
    res.json({ success: true, wishlist: user.wishlist || [] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/wishlist/:productId', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const productId = req.params.productId;
    const idx = user.wishlist?.indexOf(productId);
    if (idx >= 0) {
      user.wishlist.splice(idx, 1);
      await user.save();
      return res.json({ success: true, wishlist: user.wishlist, added: false });
    }
    user.wishlist = user.wishlist || [];
    user.wishlist.push(productId);
    await user.save();
    res.json({ success: true, wishlist: user.wishlist, added: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
