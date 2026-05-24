const express = require('express');
const router = express.Router();
const Workout = require('../models/Workout');
const Weight = require('../models/Weight');
const Recommendation = require('../models/Recommendation');
const { protect } = require('../middleware/auth');

// @route   GET /api/ai/recommend
// @desc    Generate a new AI fitness recommendation based on profile & history
// @access  Private
router.get('/recommend', protect, async (req, res) => {
  try {
    const user = req.user;
    const profile = user.profile || {};
    const goal = profile.fitnessGoal || 'maintenance';

    // 1. Fetch workout logs from the last 14 days
    const dateLimit = new Date();
    dateLimit.setDate(dateLimit.getDate() - 14);
    const recentWorkouts = await Workout.find({
      userId: user._id,
      date: { $gte: dateLimit },
    });

    // 2. Tally exercises by muscle group
    const groups = ['chest', 'legs', 'back', 'shoulders', 'arms', 'core', 'cardio'];
    const muscleTally = {};
    groups.forEach((g) => (muscleTally[g] = 0));
    recentWorkouts.forEach((w) => {
      if (muscleTally[w.muscleGroup] !== undefined) {
        muscleTally[w.muscleGroup] += w.sets;
      }
    });

    // 3. Analyze weight logs
    const recentWeights = await Weight.find({ userId: user._id })
      .sort({ date: -1 })
      .limit(3);

    let weightTrend = 'stable';
    if (recentWeights.length >= 2) {
      const diff = recentWeights[0].weight - recentWeights[recentWeights.length - 1].weight;
      if (diff > 0.5) weightTrend = 'rising';
      else if (diff < -0.5) weightTrend = 'falling';
    }

    // 4. Generate AI Recommendations based on logic
    let title = 'General Reconditioning Routine';
    let routine = [];
    let diet = '';
    let lifestyle = '';

    // Standard routines based on goals and muscular imbalances
    if (goal === 'muscle-gain') {
      title = 'AI Hypertrophy & Volume Routine';
      diet = `To support muscle synthesis, target a daily caloric surplus of +300-500 kcal (~${Math.round(profile.currentWeight * 38)} kcal). Prioritize protein intake at 2.0g per kg of bodyweight (~${Math.round(profile.currentWeight * 2)}g of protein). Ensure you consume slow-digesting proteins (casein) before sleep and fast-acting carbs + whey post-workout.`;
      lifestyle = 'Incorporate 8-9 hours of sleep per night to maximize growth hormone release. Focus on progressive overload, adding either 1 rep or 1-2kg of load to your exercises every week. Dedicate 2 days a week to full active recovery.';

      // Check muscle imbalances
      if (muscleTally['legs'] === 0) {
        title = 'AI Targeted Lower-Body & Strength Focus';
        routine = [
          { exerciseName: 'Barbell Back Squats', muscleGroup: 'legs', sets: 4, reps: 8 },
          { exerciseName: 'Romanian Deadlifts', muscleGroup: 'legs', sets: 3, reps: 10 },
          { exerciseName: 'Leg Press', muscleGroup: 'legs', sets: 3, reps: 12 },
          { exerciseName: 'Standing Calf Raises', muscleGroup: 'legs', sets: 4, reps: 15 },
          { exerciseName: 'Hanging Leg Raises', muscleGroup: 'core', sets: 3, reps: 15 },
        ];
        lifestyle += ' AI Note: You have trained chest/back recently but neglected lower body. This routine prioritizes leg development to prevent strength imbalances.';
      } else if (muscleTally['back'] < muscleTally['chest']) {
        title = 'AI Posterior Chain Correction Routine';
        routine = [
          { exerciseName: 'Deadlifts', muscleGroup: 'back', sets: 3, reps: 5 },
          { exerciseName: 'Bent-Over Barbell Rows', muscleGroup: 'back', sets: 4, reps: 8 },
          { exerciseName: 'Lat Pulldowns', muscleGroup: 'back', sets: 3, reps: 10 },
          { exerciseName: 'Face Pulls', muscleGroup: 'shoulders', sets: 3, reps: 15 },
          { exerciseName: 'Bicep Hammer Curls', muscleGroup: 'arms', sets: 3, reps: 12 },
        ];
        lifestyle += ' AI Note: Posterior imbalances detected. Focus on row movements and rear-delt activation to optimize shoulder health and posture.';
      } else {
        // Balanced muscle building plan
        routine = [
          { exerciseName: 'Incline Dumbbell Press', muscleGroup: 'chest', sets: 4, reps: 8 },
          { exerciseName: 'Pull-ups', muscleGroup: 'back', sets: 4, reps: 10 },
          { exerciseName: 'Overhead Press (OHP)', muscleGroup: 'shoulders', sets: 3, reps: 8 },
          { exerciseName: 'Barbell Squats', muscleGroup: 'legs', sets: 4, reps: 8 },
          { exerciseName: 'Tricep Rope Pushdowns', muscleGroup: 'arms', sets: 3, reps: 12 },
        ];
      }
    } else if (goal === 'weight-loss') {
      title = 'AI High-Def MetCon & Cardio Routine';
      diet = `To facilitate safe fat loss, aim for a daily caloric deficit of -500 kcal (~${Math.round(profile.currentWeight * 26)} kcal). Consume 1.8g of protein per kg of bodyweight (~${Math.round(profile.currentWeight * 1.8)}g) to preserve lean muscle tissue. Focus on fiber-rich complex carbs and green leafy vegetables to increase satiety.`;
      lifestyle = 'Maintain a high daily step count (10,000+ steps) outside the gym. Drink 3-4 liters of water daily. Execute cardio sessions immediately following resistance training or in a fasted state in the morning to maximize fat oxidation.';

      if (weightTrend === 'rising' || weightTrend === 'stable') {
        title = 'AI Accelerated Fat Burn & High Intensity Routine';
        routine = [
          { exerciseName: 'Treadmill Incline Intervals', muscleGroup: 'cardio', sets: 1, reps: 25 },
          { exerciseName: 'Kettlebell Swings', muscleGroup: 'legs', sets: 4, reps: 20 },
          { exerciseName: 'Dumbbell Thrusters', muscleGroup: 'shoulders', sets: 4, reps: 12 },
          { exerciseName: 'Renegade Rows', muscleGroup: 'back', sets: 3, reps: 10 },
          { exerciseName: 'Plank Holds', muscleGroup: 'core', sets: 3, reps: 60 },
        ];
        diet += ' AI Note: Weight loss has stabilized. cal intake should be decreased by an additional 100-150 kcal. Focus on low GI foods.';
      } else {
        routine = [
          { exerciseName: 'Assault Bike Sprint Intervals', muscleGroup: 'cardio', sets: 1, reps: 20 },
          { exerciseName: 'Goblet Squats', muscleGroup: 'legs', sets: 3, reps: 15 },
          { exerciseName: 'Push-Ups (Tempo)', muscleGroup: 'chest', sets: 3, reps: 15 },
          { exerciseName: 'Dumbbell Goblet Lunge', muscleGroup: 'legs', sets: 3, reps: 12 },
          { exerciseName: 'Ab Wheel Rollouts', muscleGroup: 'core', sets: 3, reps: 12 },
        ];
      }
    } else if (goal === 'endurance') {
      title = 'AI Cardiovascular Stamina & Core Plan';
      diet = `Fuel your long runs and circuit training by emphasizing clean carbohydrates at 50-60% of total caloric intake (~${Math.round(profile.currentWeight * 4)}g of clean carbs). Maintain hydration by drinking electrolytes pre- and post-workout.`;
      lifestyle = 'Focus on cardiovascular breathing techniques. Practice zone-2 heart rate training (60-70% of max HR) for 40+ minutes twice per week. Prioritize foam rolling and mobility work to keep joints flexible and prevent shin splints.';
      routine = [
        { exerciseName: 'Rowing Machine Interval Session', muscleGroup: 'cardio', sets: 1, reps: 30 },
        { exerciseName: 'Barbell Clean and Press', muscleGroup: 'shoulders', sets: 4, reps: 10 },
        { exerciseName: 'Box Jumps', muscleGroup: 'legs', sets: 3, reps: 12 },
        { exerciseName: 'Lat Pulldowns (High Rep)', muscleGroup: 'back', sets: 3, reps: 15 },
        { exerciseName: 'Russian Twists', muscleGroup: 'core', sets: 3, reps: 25 },
      ];
    } else {
      // Maintenance or default plan
      title = 'AI General Fitness & Metabolic Conditioning';
      diet = `Consume balanced maintenance calories (~${Math.round(profile.currentWeight * 32)} kcal) with balanced macros: 40% carbs, 30% protein, 30% healthy fats. Ensure micronutrient goals are met with vibrant fruits and vegetables.`;
      lifestyle = 'Maintain consistency by hitting the gym 3-4 days a week. Focus on active stretching and yoga to improve mobility. Rest 48 hours between training identical muscle groups.';
      routine = [
        { exerciseName: 'Flat Bench Press', muscleGroup: 'chest', sets: 3, reps: 10 },
        { exerciseName: 'Seated Cable Rows', muscleGroup: 'back', sets: 3, reps: 10 },
        { exerciseName: 'Dumbbell Lateral Raises', muscleGroup: 'shoulders', sets: 3, reps: 12 },
        { exerciseName: 'Leg Press', muscleGroup: 'legs', sets: 3, reps: 12 },
        { exerciseName: 'Plank Holds', muscleGroup: 'core', sets: 3, reps: 45 },
      ];
    }

    // Fallback: If absolutely no workouts logged yet, introduce a solid onboarding routine
    if (recentWorkouts.length === 0) {
      title = 'AI Foundation - Smart Onboarding Routine';
      routine = [
        { exerciseName: 'Goblet Squats', muscleGroup: 'legs', sets: 3, reps: 10 },
        { exerciseName: 'Dumbbell Chest Press', muscleGroup: 'chest', sets: 3, reps: 10 },
        { exerciseName: 'Lat Pulldowns', muscleGroup: 'back', sets: 3, reps: 10 },
        { exerciseName: 'Dumbbell Shoulder Press', muscleGroup: 'shoulders', sets: 3, reps: 10 },
        { exerciseName: 'Plank Holds', muscleGroup: 'core', sets: 3, reps: 30 },
      ];
      lifestyle = 'Welcome to FitOps AI! To begin, complete this full-body routine three times a week with at least one day of rest between sessions. Sleep 8 hours nightly, stay hydrated, and log your workouts so the AI Coach can begin customizing your specific routines.';
    }

    // Save recommendation to database
    const rec = await Recommendation.create({
      userId: user._id,
      title,
      workoutRoutine: routine,
      nutritionalAdvice: diet,
      lifestyleTips: lifestyle,
    });

    res.status(201).json({ success: true, data: rec });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/ai/history
// @desc    Get all generated recommendation history for user
// @access  Private
router.get('/history', protect, async (req, res) => {
  try {
    const history = await Recommendation.find({ userId: req.user._id }).sort({ generatedAt: -1 });
    res.json({ success: true, data: history });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
