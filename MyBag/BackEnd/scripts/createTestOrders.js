const mongoose = require('mongoose');
const Order = require('../models/Order');
const config = require('../config/config');

const mongoURI = config.mongoURI;

const testOrdersTemplate = [
  {
    userId: '', // to be set dynamically
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
    userId: '', // to be set dynamically
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

async function createTestOrders(userId) {
  try {
    /* console.log('Starting createTestOrders script...'); */
    await mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
    /* console.log('Connected to MongoDB'); */

    const deleteResult = await Order.deleteMany({});
    /* console.log(`Cleared existing orders: ${deleteResult.deletedCount} documents deleted`); */

    const testOrders = testOrdersTemplate.map(order => ({
      ...order,
      userId,
    }));

    const insertResult = await Order.insertMany(testOrders);
    /* console.log(`Inserted test orders: ${insertResult.length} documents inserted`); */

    await mongoose.disconnect();
    /* console.log('Disconnected from MongoDB'); */
    /* console.log('createTestOrders script completed successfully.'); */
  } catch (error) {
    console.error('Error creating test orders:', error);
  }
}

if (require.main === module) {
  const userId = process.argv[2];
  if (!userId) {
    console.error('Please provide a userId as the first argument');
    process.exit(1);
  }
  createTestOrders(userId);
}

module.exports = createTestOrders;
