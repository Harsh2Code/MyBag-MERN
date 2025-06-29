const order = require("../../models/Order");
const cart = require("../../models/Cart");
const Product = require("../../models/Product");
const Order = require("../../models/Order");
const paypal = require("@paypal/checkout-server-sdk");

// Paypal environment setup
let clientId = process.env.PAYPAL_CLIENT_ID || "YOUR_PAYPAL_CLIENT_ID";
let clientSecret = process.env.PAYPAL_CLIENT_SECRET || "YOUR_PAYPAL_CLIENT_SECRET";

let environment = new paypal.core.SandboxEnvironment(clientId, clientSecret);
let client = new paypal.core.PayPalHttpClient(environment);

const createOrder = async (req, res) => {
  try {
    const {
      userId,
      cartItems,
      addressInfo,
      orderStatus,
      paymentMethod,
      paymentStatus,
      totalAmount,
      orderDate,
      orderUpdateDate,
      paymentId,
      payerId,
      cartId,
    } = req.body;

    // Create new order instance
    const newOrder = new Order({
      userId,
      cartItems,
      addressInfo,
      orderStatus,
      paymentMethod,
      paymentStatus,
      totalAmount,
      orderDate,
      orderUpdateDate,
      paymentId,
      payerId,
      cartId,
    });

    // Save order to database
    await newOrder.save();

    // Respond with success and order ID
    res.status(201).json({
      success: true,
      orderId: newOrder._id,
    });
  } catch (e) {
    // console.error("Error in createOrder:", e);
    res.status(500).json({
      success: false,
      message: "Some Error Occurred!",
    });
  }
};

const getAllOrdersByUser = async (req, res) => {
  try {
    const userId = req.user && req.user.userId;
    // console.log("getAllOrdersByUser - req.user:", req.user);
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const orders = await Order.find({ userId });
    // console.log("getAllOrdersByUser - orders found:", orders);

    if (!orders.length) {
      return res.status(404).json({
        success: false,
        message: "No Orders Found!",
      });
    }

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (e) {
    // console.log(e);

    res.status(500).json({
      success: false,
      message: "Some Error Occured!",
    });
  }
};

const getOrderDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order Not Found!",
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (e) {
    // console.log(e);
    res.status(500).json({
      success: false,
      messgae: "Some Error Occured!",
    });
  }
};

// New function to create Paypal payment and return approval URL
const createPaypalPayment = async (req, res) => {
  const { orderId } = req.body;
  if (!orderId) {
    return res.status(400).json({ success: false, message: "Missing orderId" });
  }

  try {
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer("return=representation");
    request.requestBody({
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "USD",
            value: order.totalAmount.toFixed(2),
          },
        },
      ],
      application_context: {
        return_url: "http://localhost:3000/shop/payment-return",
        cancel_url: "http://localhost:3000/shop/checkout",
      },
    });

    const response = await client.execute(request);
    const approvalUrl = response.result.links.find(link => link.rel === "approve")?.href;

    if (!approvalUrl) {
      return res.status(500).json({ success: false, message: "No approval URL found" });
    }

    res.status(200).json({ success: true, approvalUrl });
  } catch (error) {
    // console.error("Error creating Paypal payment:", error);
    res.status(500).json({ success: false, message: "Error creating Paypal payment" });
  }
};

// New function to capture Paypal payment after approval
const capturePaypalPayment = async (req, res) => {
  const { paymentId, payerId, orderId } = req.body;
  if (!paymentId || !payerId || !orderId) {
    return res.status(400).json({ success: false, message: "Missing paymentId, payerId or orderId" });
  }

  try {
    const request = new paypal.orders.OrdersCaptureRequest(paymentId);
    request.requestBody({});

    const capture = await client.execute(request);

    if (capture.statusCode !== 201) {
      return res.status(500).json({ success: false, message: "Payment capture failed" });
    }

    // Update order payment status and payment info
    await Order.findByIdAndUpdate(orderId, {
      paymentStatus: "completed",
      paymentId,
      payerId,
      orderUpdateDate: new Date(),
    });

    res.status(200).json({ success: true });
  } catch (error) {
    // console.error("Error capturing Paypal payment:", error);
    res.status(500).json({ success: false, message: "Error capturing Paypal payment" });
  }
};

module.exports = {
  createOrder,
  getAllOrdersByUser,
  getOrderDetails,
  createPaypalPayment,
  capturePaypalPayment,
};
