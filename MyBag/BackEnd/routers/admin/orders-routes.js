const express = require('express');
const router = express.Router();

const {
  fetchAllOrders,
  getOrderById,
  updateOrderStatus,
  createOrder,
} = require('../../Controllers/admin/order-controllers');

// Get all orders
router.get('/orders', fetchAllOrders);

// Get order by ID
router.get('/orders/:id', getOrderById);

// Update order status
router.patch('/orders/:id/status', updateOrderStatus);

// Create new order
router.post('/orders', createOrder);

module.exports = router;
