
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const connectDB = require('../BackEnd/config/db');
const Query = require('../BackEnd/models/Query');

/* console.log('MONGO_URI in server.js:', process.env.MONGO_URI); */

const { loginUser, registerUser, logoutUser, authMiddleware } = require('../BackEnd/Controllers/auth/auth-controllers');
const productRoutes = require('../BackEnd/routers/Shop/Product-Routes');
const adminProductRoutes = require('../BackEnd/routers/admin/products-routes');
const orderRoutes = require('../BackEnd/routers/Shop/order-routes');
const cartRoutes = require('../BackEnd/routers/Shop/Cart-routes');
const addressRoutes = require('../BackEnd/routers/Shop/address-routes');
const authRoutes = require('../BackEnd/routers/auth/auth-routes');

const app = express();
const port = 5000;

// Connect to MongoDB
connectDB();

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'https://mybag-ui-mern.onrender.com/'],
  credentials: true,
}));
app.use(bodyParser.json());
app.use(cookieParser());

// Use auth router for all /api/auth routes
app.use('/api/auth', authRoutes);

// Middleware to verify JWT token for protected routes
// app.use('/api/queries', authMiddleware);





// POST /api/queries - open to all
app.post('/api/queries', async (req, res) => {
  const { name, email, subject, message } = req.body;
  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: 'All fields are required.' });
  }
  try {
    const newQuery = new Query({ name, email, subject, message });
    const savedQuery = await newQuery.save();
    res.status(201).json(savedQuery);
  } catch (error) {
    res.status(500).json({ error: 'Failed to save query.' });
  }
});

// GET /api/queries - protected route
app.get('/api/queries', authMiddleware, async (req, res) => {
  try {
    const queries = await Query.find().sort({ createdAt: -1 });
    res.json(queries);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch queries.' });
  }
});

app.get('/api/queries/all', async (req, res) => {
  try {
    const queries = await Query.find().sort({ createdAt: -1 });
    res.json(queries);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch queries.' });
  }
});

  
// Register Shop routers
app.use('/api/admin/products', adminProductRoutes);
app.use('/api/shop/products', productRoutes); // Added this line to fix 404 on shop products
app.use('/api/admin/orders', orderRoutes);
app.use('/api/shop/order', orderRoutes);
app.use('/api/shop/cart', cartRoutes);
app.use('/api/shop/address', addressRoutes);

app.listen(port, () => {
  /* console.log(`Backend server running on http://localhost:${port}`); */
});
