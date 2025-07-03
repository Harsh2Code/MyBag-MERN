const mongoose = require('mongoose');
const Order = require('../models/Order');

const mongoURI = 'mongodb://localhost:27017/auth-app'; // Updated to match backend config and createTestOrders.js

async function listOrders() {
  try {
    await mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB');

    const orders = await Order.find();
    console.log('Orders in database:', orders);

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error listing orders:', error);
  }
}

listOrders();
