const Order = require('../../models/Order');

// Fetch all orders
const fetchAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('userId', 'name email').populate('cartItems.productId', 'title price');
    res.status(200).json(orders);
  } catch (error) {
    console.error('Error in fetchAllOrders:', error);
    res.status(500).json({ message: 'Failed to fetch orders', error });
  }
};

// Get order by ID
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('userId', 'name email').populate('products.productId', 'title price');
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch order', error });
  }
};

// Update order status
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const updateData = { orderStatus: status, orderUpdateDate: new Date() };
    const order = await Order.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    console.log(`Order ${req.params.id} status updated to ${status}`);
    res.status(200).json(order);
  } catch (error) {
    console.error('Error updating order status:', error.message, error.stack);
    res.status(500).json({ message: 'Failed to update order status', error: error.message });
  }
};

// Create new order
const createOrder = async (req, res) => {
  try {
    const orderData = req.body;

    const newOrder = new Order(orderData);
    await newOrder.save();

    res.status(201).json({ success: true, data: newOrder });
  } catch (error) {
    console.error('Error in createOrder:', error);
    res.status(500).json({ message: 'Failed to create order', error });
  }
};

// New method to update product status in an order
const updateProductStatus = async (req, res) => {
  try {
    const { orderId, productId } = req.params;
    const { status } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const product = order.cartItems.find(item => item.productId.toString() === productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found in order' });
    }

    product.status = status;
    await order.save();

    res.status(200).json({ message: 'Product status updated', order });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update product status', error });
  }
};

module.exports = {
  fetchAllOrders,
  getOrderById,
  updateOrderStatus,
  createOrder,
  updateProductStatus,
};
