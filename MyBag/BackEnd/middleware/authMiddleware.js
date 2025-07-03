const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = req.cookies.token;
  console.log("authMiddleware - token received:", token);
  if (!token) {
    console.log("authMiddleware - no token found in cookies");
    return res.status(401).json({
      success: false,
      message: 'Unauthorized user'
    });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
    console.log("Decoded JWT token:", decoded);
    req.user = decoded;
    return next();
  } catch (error) {
    console.log("authMiddleware - token verification failed:", error.message);
    return res.status(401).json({
      success: false,
      message: 'Unauthorized user'
    });
  }
};

module.exports = { authMiddleware };
