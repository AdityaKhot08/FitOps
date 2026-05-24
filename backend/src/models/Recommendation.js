const mongoose = require('mongoose');

const RecommendationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    default: 'Personalized Workout Plan',
  },
  workoutRoutine: [
    {
      exerciseName: { type: String, required: true },
      muscleGroup: { type: String, required: true },
      sets: { type: Number, required: true },
      reps: { type: Number, required: true },
    },
  ],
  nutritionalAdvice: {
    type: String,
    required: true,
  },
  lifestyleTips: {
    type: String,
    required: true,
  },
  generatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Recommendation', RecommendationSchema);
