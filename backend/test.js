const assert = require('node:assert');

// 1. Mocking the AI decision logic that runs in our express backend
function generateMockRecommendation(userProfile, recentWorkouts, recentWeights) {
  const goal = userProfile.fitnessGoal || 'maintenance';
  const currentWeight = userProfile.currentWeight || 70;
  
  // Tally sets per muscle group
  const muscleTally = { chest: 0, legs: 0, back: 0, shoulders: 0, arms: 0, core: 0, cardio: 0 };
  recentWorkouts.forEach((w) => {
    if (muscleTally[w.muscleGroup] !== undefined) {
      muscleTally[w.muscleGroup] += w.sets;
    }
  });

  // Trend detection
  let weightTrend = 'stable';
  if (recentWeights.length >= 2) {
    const diff = recentWeights[0] - recentWeights[recentWeights.length - 1];
    if (diff > 0.5) weightTrend = 'rising';
    else if (diff < -0.5) weightTrend = 'falling';
  }

  let title = 'General Reconditioning Routine';
  let dietKcal = 0;
  let hasLegRecommendation = false;
  let hasPosteriorRecommendation = false;

  if (goal === 'muscle-gain') {
    title = 'AI Hypertrophy & Volume Routine';
    dietKcal = Math.round(currentWeight * 38);

    if (muscleTally['legs'] === 0) {
      title = 'AI Targeted Lower-Body & Strength Focus';
      hasLegRecommendation = true;
    } else if (muscleTally['back'] < muscleTally['chest']) {
      title = 'AI Posterior Chain Correction Routine';
      hasPosteriorRecommendation = true;
    }
  } else if (goal === 'weight-loss') {
    title = 'AI High-Def MetCon & Cardio Routine';
    dietKcal = Math.round(currentWeight * 26);
  }

  return { title, dietKcal, hasLegRecommendation, hasPosteriorRecommendation, weightTrend };
}

// 2. Unit Test Suite
console.log('=== RUNNING FITOPS AI BACKEND TEST SUITE ===');

try {
  // Test Case 1: Muscle Gain goal with Leg neglect imbalance detection
  console.log('Running Test Case 1: Leg imbalance detection...');
  const user1 = { fitnessGoal: 'muscle-gain', currentWeight: 80 };
  const workouts1 = [
    { exerciseName: 'Bench Press', muscleGroup: 'chest', sets: 4 },
    { exerciseName: 'Barbell Row', muscleGroup: 'back', sets: 4 },
  ]; // Leg sets = 0
  const weights1 = [80, 80];

  const rec1 = generateMockRecommendation(user1, workouts1, weights1);
  assert.strictEqual(rec1.title, 'AI Targeted Lower-Body & Strength Focus');
  assert.strictEqual(rec1.dietKcal, 3040); // 80 * 38
  assert.strictEqual(rec1.hasLegRecommendation, true);
  console.log('✓ Test Case 1 Passed!');

  // Test Case 2: Muscle Gain goal with Posterior Chain (back) neglect
  console.log('Running Test Case 2: Posterior chain neglect detection...');
  const user2 = { fitnessGoal: 'muscle-gain', currentWeight: 75 };
  const workouts2 = [
    { exerciseName: 'Bench Press', muscleGroup: 'chest', sets: 6 },
    { exerciseName: 'Squat', muscleGroup: 'legs', sets: 4 },
    { exerciseName: 'Row', muscleGroup: 'back', sets: 2 }, // back sets (2) < chest sets (6)
  ];
  const weights2 = [75, 75];

  const rec2 = generateMockRecommendation(user2, workouts2, weights2);
  assert.strictEqual(rec2.title, 'AI Posterior Chain Correction Routine');
  assert.strictEqual(rec2.dietKcal, 2850); // 75 * 38
  assert.strictEqual(rec2.hasPosteriorRecommendation, true);
  console.log('✓ Test Case 2 Passed!');

  // Test Case 3: Weight Loss stalling logic
  console.log('Running Test Case 3: Weight loss stall monitoring...');
  const user3 = { fitnessGoal: 'weight-loss', currentWeight: 90 };
  const workouts3 = [{ exerciseName: 'Running', muscleGroup: 'cardio', sets: 1 }];
  const weights3 = [90.6, 90.5, 90.0]; // Weight stabilized/rising over entries (90.6 vs 90.0)

  const rec3 = generateMockRecommendation(user3, workouts3, weights3);
  assert.strictEqual(rec3.title, 'AI High-Def MetCon & Cardio Routine');
  assert.strictEqual(rec3.dietKcal, 2340); // 90 * 26
  assert.strictEqual(rec3.weightTrend, 'rising'); // 90.6 - 90.0 = 0.6 (rising)
  console.log('✓ Test Case 3 Passed!');

  console.log('\n=== ALL TESTS PASSED SUCCESSFULLY! ===');
  process.exit(0);
} catch (error) {
  console.error('\n❌ TEST SUITE FAILED!');
  console.error(error);
  process.exit(1);
}
