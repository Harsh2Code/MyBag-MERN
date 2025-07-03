const mongoose = require('mongoose');
const Order = require('../models/Order');

const mongoURI = 'mongodb://VITE_BACKEND_URL:27017/auth-app'; // Updated to match backend config

const testOrders = [
  {
    userId: 'user123',
    cartId: 'cart123',
    cartItems: [
      {
        productId: 'prod1',
        title: 'Test Product 1',
        image: 'image1.jpg',
        price: '29.99',
        quantity: 2,
      },
      {
        productId: 'prod2',
        title: 'Test Product 2',
        image: 'image2.jpg',
        price: '49.99',
        quantity: 1,
      },
    ],
    addressInfo: {
      addressId: 'addr1',
      address: '123 Test St',
      city: 'Testville',
      pincode: '12345',
      phone: '1234567890',
      notes: 'Leave at door',
    },
    orderStatus: 'Pending',
    paymentMethod: 'Credit Card',
    paymentStatus: 'Paid',
    totalAmount: 109.97,
    orderDate: new Date(),
    orderUpdateDate: new Date(),
    paymentId: 'pay123',
    payerId: 'payer123',
  },
  {
    userId: 'user456',
    cartId: 'cart456',
    cartItems: [
      {
        productId: 'prod3',
        title: 'Test Product 3',
        image: 'image3.jpg',
        price: '19.99',
        quantity: 3,
      },
    ],
    addressInfo: {
      addressId: 'addr2',
      address: '456 Example Ave',
      city: 'Exampletown',
      pincode: '67890',
      phone: '0987654321',
      notes: '',
    },
    orderStatus: 'Shipped',
    paymentMethod: 'PayPal',
    paymentStatus: 'Paid',
    totalAmount: 59.97,
    orderDate: new Date(),
    orderUpdateDate: new Date(),
    paymentId: 'pay456',
    payerId: 'payer456',
  },
];

async function createTestOrders() {
  try {
    /* console.log('Starting createTestOrders script...'); */
    await mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
    /* console.log('Connected to MongoDB'); */

    const deleteResult = await Order.deleteMany({});
    /* console.log(`Cleared existing orders: ${deleteResult.deletedCount} documents deleted`); */

    const insertResult = await Order.insertMany(testOrders);
    /* console.log(`Inserted test orders: ${insertResult.length} documents inserted`); */

    await mongoose.disconnect();
    /* console.log('Disconnected from MongoDB'); */
    /* console.log('createTestOrders script completed successfully.'); */
  } catch (error) {
    console.error('Error creating test orders:', error);
  }
}

createTestOrders();
