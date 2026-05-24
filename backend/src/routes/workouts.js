const express = require('express');
const router = express.Router();
const Workout = require('../models/Workout');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// Helper to calculate streak based on the last workout date and current workout date
const updateStreak = async (user, workoutDate) => {
  const lastDate = user.lastWorkoutDate;
  const currentDate = new Date(workoutDate);

  // Clear times to compare dates only
  currentDate.setHours(0, 0, 0, 0);

  if (!lastDate) {
    user.streak = 1;
    user.lastWorkoutDate = workoutDate;
    await user.save();
    return;
  }

  const lastWorkout = new Date(lastDate);
  lastWorkout.setHours(0, 0, 0, 0);

  const diffTime = Math.abs(currentDate - lastWorkout);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 1) {
    // Consecutive day
    user.streak += 1;
    user.lastWorkoutDate = workoutDate;
  } else if (diffDays > 1) {
    // Stale streak, reset to 1
    user.streak = 1;
    user.lastWorkoutDate = workoutDate;
  } else if (diffDays === 0) {
    // Same day workout, don't change streak but update last workout timestamp if newer
    if (new Date(workoutDate) > new Date(lastDate)) {
      user.lastWorkoutDate = workoutDate;
    }
  }

  await user.save();
};

// @route   GET /api/workouts
// @desc    Get all user workouts
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const workouts = await Workout.find({ userId: req.user._id }).sort({ date: -1 });
    res.json({ success: true, data: workouts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/workouts
// @desc    Create a workout log
// @access  Private
router.post('/', protect, async (req, res) => {
  const { exerciseName, muscleGroup, sets, reps, weightLifted, duration, date } = req.body;

  try {
    const workout = await Workout.create({
      userId: req.user._id,
      exerciseName,
      muscleGroup,
      sets,
      reps,
      weightLifted,
      duration,
      date: date || new Date(),
    });

    // Update user streak & last workout timestamp
    const user = await User.findById(req.user._id);
    if (user) {
      await updateStreak(user, workout.date);
    }

    res.status(201).json({ success: true, data: workout });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/workouts/:id
// @desc    Update a workout log
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    let workout = await Workout.findById(req.id || req.params.id);

    if (!workout) {
      return res.status(404).json({ success: false, message: 'Workout not found' });
    }

    // Check ownership
    if (workout.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    workout = await Workout.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json({ success: true, data: workout });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   DELETE /api/workouts/:id
// @desc    Delete a workout log
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const workout = await Workout.findById(req.params.id);

    if (!workout) {
      return res.status(404).json({ success: false, message: 'Workout not found' });
    }

    // Check ownership
    if (workout.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    await workout.deleteOne();
    res.json({ success: true, message: 'Workout removed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
