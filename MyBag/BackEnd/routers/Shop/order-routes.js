const express = require("express");
const capturePayment = require("../../Controllers/Shop/capturePayment");

const {
  createOrder,
  getAllOrdersByUser,
  getOrderDetails,
  createPaypalPayment,
  capturePaypalPayment,
} = require("../../Controllers/Shop/order-controller");
const Order = require("../../models/Order");
const router = express.Router();

router.post("/create", createOrder);
router.post("/capture", capturePayment);
const { authMiddleware } = require("../../middleware/authMiddleware");

router.get("/list", authMiddleware, getAllOrdersByUser);
router.get("/details/:id", getOrderDetails);

  
// routes for Paypal payment
router.post("/create-paypal-payment", createPaypalPayment);
router.post("/capture-paypal-payment", capturePaypalPayment);

// GET /orders - get all orders for admin
router.get("/orders", async (req, res) => {
  try {
    const orders = await Order.find().sort({ orderDate: -1 });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch orders." });
  }
});

// PATCH /orders/:orderId/status - update order status
router.patch("/orders/:orderId/status", async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ success: false, message: "Status is required" });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    order.orderStatus = status;
    order.orderUpdateDate = new Date();

    await order.save();

    res.status(200).json({ success: true, message: "Order status updated", data: order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to update order status" });
  }
});

module.exports = router;
