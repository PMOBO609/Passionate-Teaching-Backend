const express = require('express');
const Course = require('../models/Course');
const { protect, restrictTo } = require('../middleware/auth');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { category, search } = req.query;
    let filter = { isPublished: true };

    if (category) filter.category = category;
    if (search) filter.title = { $regex: search, $options: 'i' };

    const courses = await Course.find(filter)
      .populate('instructor', 'name avatar')
      .sort({ createdAt: -1 });

    res.json({ success: true, courses });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('instructor', 'name avatar')
      .populate('reviews.user', 'name avatar');

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.json({ success: true, course });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/', protect, restrictTo('instructor', 'admin'), async (req, res) => {
  try {
    const course = await Course.create({
      ...req.body,
      instructor: req.user._id
    });
    res.status(201).json({ success: true, course });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.put('/:id', protect, restrictTo('instructor', 'admin'), async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json({ success: true, course });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;