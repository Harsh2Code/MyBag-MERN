const express = require('express');
const router = express.Router();
const { registerUser, loginUser, logoutUser, authMiddleware, refreshToken, getUserProfile } = require('../../Controllers/auth/auth-controllers');
const { check } = require('express-validator');

// Input validation middleware
const validateRegisterInput = [
    check('name').notEmpty().withMessage('Name is required'),
    check('Email').isEmail().withMessage('Valid email is required'),
    check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];

const validateLoginInput = [
    check('Email').isEmail().withMessage('Valid email is required'),
    check('password').notEmpty().withMessage('Password is required')
];

// Auth routes
router.post('/register', validateRegisterInput, registerUser);
router.post('/login', validateLoginInput, loginUser);
router.post('/logout', logoutUser);
router.post('/refresh-token', refreshToken);
router.post('/check-auth', authMiddleware, (req, res) => {
    return res.status(200).json({
        success: true,
        message: 'User is authenticated!',
        user: req.user
    });
});

// New route to get user profile by userId
router.get('/user/:userId', authMiddleware, getUserProfile);

module.exports = router;
