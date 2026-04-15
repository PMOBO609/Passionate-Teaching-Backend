const express = require('express');
const User = require('../models/User');
const { protect, restrictTo } = require('../middleware/auth');
const router = express.Router();

router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('enrolledCourses')
      .populate('wishlist');
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/', protect, restrictTo('admin'), async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/me', protect, async (req, res) => {
  try {
    const { name, avatar } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, avatar },
      { new: true }
    ).select('-password');
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;