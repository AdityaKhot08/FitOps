const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email address',
    ],
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 6,
    select: false, // Prevents password from being returned in standard queries
  },
  profile: {
    age: { type: Number, default: 25 },
    height: { type: Number, default: 175 }, // in cm
    currentWeight: { type: Number, default: 70 }, // in kg
    targetWeight: { type: Number, default: 70 }, // in kg
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
      default: 'male',
    },
    fitnessGoal: {
      type: String,
      enum: ['weight-loss', 'muscle-gain', 'endurance', 'maintenance'],
      default: 'maintenance',
    },
    activityLevel: {
      type: String,
      enum: ['sedentary', 'light', 'moderate', 'active'],
      default: 'moderate',
    },
  },
  streak: {
    type: Number,
    default: 0,
  },
  lastWorkoutDate: {
    type: Date,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Hash password prior to saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match user-entered password to hashed password in database
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
