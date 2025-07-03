require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

async function checkAdminUser() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ecommerce');
    console.log('Connected to MongoDB');

    const adminUser = await User.findOne({ Email: 'admin@example.com' });
    console.log(adminUser ? 'Admin user exists' : 'Admin user not found');

    await mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

checkAdminUser();
