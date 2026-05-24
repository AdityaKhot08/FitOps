const mongoose = require('mongoose');

const WorkoutSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  exerciseName: {
    type: String,
    required: [true, 'Please add an exercise name'],
    trim: true,
  },
  muscleGroup: {
    type: String,
    required: [true, 'Please add a muscle group'],
    enum: ['chest', 'legs', 'back', 'shoulders', 'arms', 'core', 'cardio'],
  },
  sets: {
    type: Number,
    required: [true, 'Please add number of sets'],
    min: [1, 'Must do at least 1 set'],
  },
  reps: {
    type: Number,
    required: [true, 'Please add number of reps'],
    min: [1, 'Must do at least 1 rep'],
  },
  weightLifted: {
    type: Number,
    required: [true, 'Please add weight lifted (use 0 for bodyweight)'],
    min: [0, 'Weight cannot be negative'],
  },
  duration: {
    type: Number,
    required: [true, 'Please add workout duration in minutes'],
    min: [1, 'Duration must be at least 1 minute'],
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

module.exports = mongoose.model('Workout', WorkoutSchema);
