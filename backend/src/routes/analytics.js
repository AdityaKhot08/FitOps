const express = require('express');
const router = express.Router();
const Workout = require('../models/Workout');
const Weight = require('../models/Weight');
const Goal = require('../models/Goal');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// @route   GET /api/analytics
// @desc    Get dashboard analytics metrics
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);

    // 1. Fetch data
    const workouts = await Workout.find({ userId }).sort({ date: -1 });
    const weights = await Weight.find({ userId }).sort({ date: 1 });
    const goals = await Goal.find({ userId });

    // 2. BMI Calculation
    const height = user.profile.height || 175; // in cm
    const currentWeight = user.profile.currentWeight || 70; // in kg
    const heightInMeters = height / 100;
    const bmi = (currentWeight / (heightInMeters * heightInMeters)).toFixed(1);

    // 3. Calories Burned calculation (approximation)
    // Approximate burn rate: cardio = 8.5 kcal/min, resistance/others = 6.0 kcal/min
    let totalCaloriesBurned = 0;
    workouts.forEach((w) => {
      const burnRate = w.muscleGroup === 'cardio' ? 8.5 : 6.0;
      totalCaloriesBurned += Math.round(w.duration * burnRate);
    });

    // 4. Workout Frequency - Workouts over the last 7 days
    const last7DaysCount = [0, 0, 0, 0, 0, 0, 0];
    const daysName = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      daysName.push(date.toLocaleDateString('en-US', { weekday: 'short' }));
      
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      const count = workouts.filter(
        (w) => new Date(w.date) >= startOfDay && new Date(w.date) <= endOfDay
      ).length;
      
      last7DaysCount[6 - i] = count;
    }

    // 5. Muscle group breakdown (for pie chart)
    const muscleBreakdown = {
      chest: 0,
      legs: 0,
      back: 0,
      shoulders: 0,
      arms: 0,
      core: 0,
      cardio: 0,
    };
    workouts.forEach((w) => {
      if (muscleBreakdown[w.muscleGroup] !== undefined) {
        muscleBreakdown[w.muscleGroup] += 1;
      }
    });

    // 6. Weight progress (last 8 weight entries)
    const weightChartLabels = [];
    const weightChartData = [];
    
    const weightLogs = weights.slice(-8); // Get latest 8 logs
    weightLogs.forEach((w) => {
      weightChartLabels.push(new Date(w.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
      weightChartData.push(w.weight);
    });

    // If there is only 1 or no weights logged, use profile weight as a base
    if (weightChartData.length === 0) {
      weightChartLabels.push('Initial');
      weightChartData.push(user.profile.currentWeight);
    }

    // 7. Goals status tally
    const completedGoals = goals.filter((g) => g.status === 'achieved').length;
    const totalGoals = goals.length;
    const goalCompletionPercentage = totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0;

    // 8. Assemble response
    res.json({
      success: true,
      data: {
        streak: user.streak,
        bmi,
        totalCaloriesBurned,
        totalWorkouts: workouts.length,
        userProfile: user.profile,
        userName: user.name,
        recentActivities: workouts.slice(0, 4), // Latest 4 workouts
        frequency: {
          labels: daysName,
          data: last7DaysCount,
        },
        muscleDistribution: muscleBreakdown,
        weightHistory: {
          labels: weightChartLabels,
          data: weightChartData,
        },
        goalsProgress: {
          total: totalGoals,
          completed: completedGoals,
          percentage: goalCompletionPercentage,
          active: goals.filter((g) => g.status === 'in-progress'),
        },
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
