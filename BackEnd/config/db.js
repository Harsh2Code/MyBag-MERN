const mongoose = require('mongoose');
const config = require('./config');

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(config.mongoURI, {
    });
    if (config.mongoURI.includes('mongodb+srv')) {
      console.log('Connected to MongoDB Atlas database:', connection.connection.db.databaseName);
    } else {
      console.log('Connected to local MongoDB database:', connection.connection.db.databaseName);
    }
  } catch (err) {
    console.error('Failed to connect to MongoDB Atlas:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
