const express = require('express');
const router = express.Router();
const Weight = require('../models/Weight');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// @route   GET /api/weights
// @desc    Get all weight logs
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const weights = await Weight.find({ userId: req.user._id }).sort({ date: 1 }); // Sorted chronologically for graphing
    res.json({ success: true, data: weights });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/weights
// @desc    Add a weight log
// @access  Private
router.post('/', protect, async (req, res) => {
  const { weight, date } = req.body;

  try {
    const weightLog = await Weight.create({
      userId: req.user._id,
      weight,
      date: date || new Date(),
    });

    // Sync user current weight in profile
    const user = await User.findById(req.user._id);
    if (user) {
      user.profile.currentWeight = weight;
      await user.save();
    }

    res.status(201).json({ success: true, data: weightLog });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// @route   DELETE /api/weights/:id
// @desc    Delete a weight log
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const weightLog = await Weight.findById(req.params.id);

    if (!weightLog) {
      return res.status(404).json({ success: false, message: 'Weight log not found' });
    }

    // Check ownership
    if (weightLog.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    await weightLog.deleteOne();

    // Re-sync user weight to the latest logged entry if one exists
    const latestWeight = await Weight.findOne({ userId: req.user._id }).sort({ date: -1 });
    const user = await User.findById(req.user._id);
    if (user && latestWeight) {
      user.profile.currentWeight = latestWeight.weight;
      await user.save();
    }

    res.json({ success: true, message: 'Weight log removed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
