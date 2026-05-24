const mongoose = require('mongoose');

const connectDB = async () => {
  const connUri = process.env.MONGO_URI || 'mongodb://localhost:27017/fitops';
  console.log(`Attempting to connect to database: ${connUri.replace(/:([^:@]+)@/, ':***@')}`);

  const options = {
    serverSelectionTimeoutMS: 5000,
  };

  try {
    const conn = await mongoose.connect(connUri, options);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Database Connection Error: ${error.message}`);
    console.log('Continuing server initialization; will retry connection on demand.');
  }
};

module.exports = connectDB;
