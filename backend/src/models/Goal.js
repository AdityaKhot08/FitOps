const mongoose = require('mongoose');

const GoalSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: [true, 'Please add a goal title'],
    trim: true,
  },
  type: {
    type: String,
    required: true,
    enum: ['weight', 'workout-count', 'duration', 'strength'],
  },
  targetValue: {
    type: Number,
    required: [true, 'Please specify a target value'],
  },
  currentValue: {
    type: Number,
    default: 0,
  },
  deadline: {
    type: Date,
    required: [true, 'Please provide a target deadline'],
  },
  status: {
    type: String,
    enum: ['in-progress', 'achieved', 'failed'],
    default: 'in-progress',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Goal', GoalSchema);
