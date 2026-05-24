const express = require('express');
const router = express.Router();
const Goal = require('../models/Goal');
const { protect } = require('../middleware/auth');

// @route   GET /api/goals
// @desc    Get all user goals
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const goals = await Goal.find({ userId: req.user._id }).sort({ deadline: 1 });
    res.json({ success: true, data: goals });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/goals
// @desc    Create a fitness goal
// @access  Private
router.post('/', protect, async (req, res) => {
  const { title, type, targetValue, currentValue, deadline } = req.body;

  try {
    const goal = await Goal.create({
      userId: req.user._id,
      title,
      type,
      targetValue,
      currentValue: currentValue || 0,
      deadline,
    });

    res.status(201).json({ success: true, data: goal });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/goals/:id
// @desc    Update a goal
// @access  Private
router.put('/:id', protect, async (req, res) => {
  const { title, targetValue, currentValue, deadline, status } = req.body;

  try {
    let goal = await Goal.findById(req.params.id);

    if (!goal) {
      return res.status(404).json({ success: false, message: 'Goal not found' });
    }

    // Check ownership
    if (goal.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    // Automatic status update if currentValue meets or exceeds targetValue
    let updatedStatus = status || goal.status;
    if (currentValue !== undefined && targetValue !== undefined) {
      if (currentValue >= targetValue) {
        updatedStatus = 'achieved';
      }
    } else if (currentValue !== undefined) {
      if (currentValue >= goal.targetValue) {
        updatedStatus = 'achieved';
      }
    }

    goal.title = title || goal.title;
    goal.targetValue = targetValue !== undefined ? targetValue : goal.targetValue;
    goal.currentValue = currentValue !== undefined ? currentValue : goal.currentValue;
    goal.deadline = deadline || goal.deadline;
    goal.status = updatedStatus;

    const updatedGoal = await goal.save();

    res.json({ success: true, data: updatedGoal });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   DELETE /api/goals/:id
// @desc    Delete a goal
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id);

    if (!goal) {
      return res.status(404).json({ success: false, message: 'Goal not found' });
    }

    // Check ownership
    if (goal.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    await goal.deleteOne();
    res.json({ success: true, message: 'Goal removed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
