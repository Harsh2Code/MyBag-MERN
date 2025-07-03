require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

async function testConnection() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ecommerce');
    console.log('Successfully connected to MongoDB');

    // Check admin user
    const admin = await User.findOne({ Email: 'admin@example.com' });
    console.log(admin ? 'Admin user exists' : 'Admin user not found');

    // Close connection
    await mongoose.connection.close();
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

testConnection();
