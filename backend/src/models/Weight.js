const mongoose = require('mongoose');

const WeightSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  weight: {
    type: Number,
    required: [true, 'Please add a body weight value'],
    min: [10, 'Weight must be realistic'],
  },
  date: {
    type: Date,
    default: Date.now,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Weight', WeightSchema);
