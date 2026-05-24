require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Workout = require('./models/Workout');
const Weight = require('./models/Weight');
const Goal = require('./models/Goal');
const Recommendation = require('./models/Recommendation');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/fitops';

const seedDatabase = async () => {
  try {
    console.log('Connecting to database for seeding...');
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB Connected. Clearing existing collections...');

    // Clear old data
    await User.deleteMany({});
    await Workout.deleteMany({});
    await Weight.deleteMany({});
    await Goal.deleteMany({});
    await Recommendation.deleteMany({});

    console.log('Creating demo user...');
    // Create Demo User
    const demoUser = await User.create({
      name: 'DevOps Coach Demo',
      email: 'coach_demo@fitops.ai',
      password: 'fitops123', // Will be hashed automatically by pre-save hook
      profile: {
        age: 28,
        height: 182,
        currentWeight: 84.5,
        targetWeight: 80.0,
        gender: 'male',
        fitnessGoal: 'weight-loss',
        activityLevel: 'moderate',
      },
      streak: 4,
      lastWorkoutDate: new Date(),
    });

    console.log(`Demo User Created: ${demoUser.email}`);

    // Create Chronological Weight Logs
    console.log('Logging historical scale weights...');
    const weights = [];
    const baseWeight = 86.8;
    for (let i = 8; i >= 0; i--) {
      const logDate = new Date();
      logDate.setDate(logDate.getDate() - i * 2);
      // Simulate weight decline with a stall at the end
      let currentScale = baseWeight - (8 - i) * 0.4;
      if (i <= 2) {
        currentScale = 84.5; // Stalled weight for last logs to trigger AI
      }
      weights.push({
        userId: demoUser._id,
        weight: parseFloat(currentScale.toFixed(1)),
        date: logDate,
      });
    }
    await Weight.insertMany(weights);

    // Create Workouts logs
    console.log('Logging training activities...');
    const today = new Date();
    const workoutsData = [
      {
        exerciseName: 'Incline Dumbbell Bench Press',
        muscleGroup: 'chest',
        sets: 4,
        reps: 8,
        weightLifted: 32,
        duration: 45,
        date: new Date(today.getTime() - 8 * 24 * 60 * 60 * 1000), // 8 days ago
      },
      {
        exerciseName: 'Flat Chest Barbell Press',
        muscleGroup: 'chest',
        sets: 3,
        reps: 10,
        weightLifted: 70,
        duration: 35,
        date: new Date(today.getTime() - 8 * 24 * 60 * 60 * 1000),
      },
      {
        exerciseName: 'Deadlifts',
        muscleGroup: 'back',
        sets: 3,
        reps: 5,
        weightLifted: 120,
        duration: 50,
        date: new Date(today.getTime() - 6 * 24 * 60 * 60 * 1000), // 6 days ago
      },
      {
        exerciseName: 'Bent-Over Dumbbell Rows',
        muscleGroup: 'back',
        sets: 4,
        reps: 10,
        weightLifted: 26,
        duration: 40,
        date: new Date(today.getTime() - 6 * 24 * 60 * 60 * 1000),
      },
      {
        exerciseName: 'Standing Dumbbell Shoulder Press',
        muscleGroup: 'shoulders',
        sets: 4,
        reps: 8,
        weightLifted: 22,
        duration: 45,
        date: new Date(today.getTime() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
      },
      {
        exerciseName: 'Cable Lateral Raises',
        muscleGroup: 'shoulders',
        sets: 3,
        reps: 12,
        weightLifted: 10,
        duration: 30,
        date: new Date(today.getTime() - 4 * 24 * 60 * 60 * 1000),
      },
      {
        exerciseName: 'HIIT Sprints on Treadmill',
        muscleGroup: 'cardio',
        sets: 1,
        reps: 20,
        weightLifted: 0,
        duration: 20,
        date: new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      },
      {
        exerciseName: 'Hanging Knee Raises',
        muscleGroup: 'core',
        sets: 3,
        reps: 15,
        weightLifted: 0,
        duration: 15,
        date: new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      },
    ];

    // NOTE: Leg volume is completely 0 in this list to trigger the AI Coach lower-body neglect check!
    await Workout.insertMany(
      workoutsData.map((w) => ({
        ...w,
        userId: demoUser._id,
      }))
    );

    // Create Fitness Goals
    console.log('Establishing fitness target goals...');
    const goalsData = [
      {
        userId: demoUser._id,
        title: 'Reach 80kg Scale Weight',
        type: 'weight',
        targetValue: 80.0,
        currentValue: 84.5,
        deadline: new Date(today.getTime() + 45 * 24 * 60 * 60 * 1000), // 45 days in future
        status: 'in-progress',
      },
      {
        userId: demoUser._id,
        title: 'Perform 12 Gym Sessions',
        type: 'workout-count',
        targetValue: 12,
        currentValue: 8,
        deadline: new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000), // 14 days in future
        status: 'in-progress',
      },
      {
        userId: demoUser._id,
        title: 'Achieved 4-Day Gym Streak',
        type: 'workout-count',
        targetValue: 4,
        currentValue: 4,
        deadline: new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000),
        status: 'achieved',
      },
    ];
    await Goal.insertMany(goalsData);

    // Create Initial AI Coach recommendation
    console.log('Generating initial AI Coach tips...');
    await Recommendation.create({
      userId: demoUser._id,
      title: 'AI Targeted Lower-Body & Strength Focus',
      workoutRoutine: [
        { exerciseName: 'Barbell Back Squats', muscleGroup: 'legs', sets: 4, reps: 8 },
        { exerciseName: 'Romanian Deadlifts', muscleGroup: 'legs', sets: 3, reps: 10 },
        { exerciseName: 'Leg Press', muscleGroup: 'legs', sets: 3, reps: 12 },
        { exerciseName: 'Standing Calf Raises', muscleGroup: 'legs', sets: 4, reps: 15 },
        { exerciseName: 'Hanging Leg Raises', muscleGroup: 'core', sets: 3, reps: 15 },
      ],
      nutritionalAdvice: 'To facilitate safe fat loss, aim for a daily caloric deficit of -500 kcal (~2197 kcal). Consume 1.8g of protein per kg of bodyweight (~152g) to preserve lean muscle tissue. Focus on fiber-rich complex carbs and green leafy vegetables to increase satiety. AI Note: Weight loss has stabilized. Caloric intake should be decreased by an additional 100-150 kcal. Focus on low GI foods.',
      lifestyleTips: 'Maintain a high daily step count (10,000+ steps) outside the gym. Drink 3-4 liters of water daily. Execute cardio sessions immediately following resistance training or in a fasted state in the morning to maximize fat oxidation. AI Note: You have trained chest/back recently but neglected lower body. This routine prioritizes leg development to prevent strength imbalances.',
    });

    console.log('\n=== SEED DATA LOADED SUCCESSFULLY! ===');
    console.log(`Demo Profile details:`);
    console.log(`  Login Email: coach_demo@fitops.ai`);
    console.log(`  Login Password: fitops123`);
    console.log('====================================');
    mongoose.connection.close();
  } catch (error) {
    console.error(`Seeding Failed: ${error.message}`);
    process.exit(1);
  }
};

seedDatabase();
