const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require("../../models/User");

const registerUser = async (req, res) => {
    const { name, Email, password, role } = req.body;
    try {
        if (!password) throw new Error('Password is undefined');
        const hashPassword = await bcrypt.hash(password, 12);
        const newUser = new User({
            name,
            Email,
            password: hashPassword,
            role: role || 'user'
        });
        await newUser.save();
        res.status(201).json({
            success: true,
            message: "User registered successfully",
        });
    } catch (e) {
        if (e.code === 11000) {
            return res.status(400).json({
                success: false,
                message: "Email already exists",
                error: "This email is already registered"
            });
        }
        res.status(500).json({
            success: false,
            message: "Error in registration",
            error: e.message
        });
    }
};

const loginUser = async (req, res) => {
    const { Email, password } = req.body;
    try {
        const user = await User.findOne({ Email: { $regex: new RegExp(`^${Email}$`, 'i') } });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        if (!password || !user.password) {
            return res.status(400).json({
                success: false,
                message: "Password validation failed"
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
        }

        let token;
        let refreshToken;
        try {
            const secret = process.env.JWT_SECRET;
            const refreshSecret = process.env.JWT_REFRESH_SECRET || 'your_jwt_refresh_secret';
            if (!secret) {
                throw new Error('JWT_SECRET is not defined');
            }
            token = jwt.sign(
                { userId: user._id, role: user.role },
                secret,
                { expiresIn: '15m' }
            );
            refreshToken = jwt.sign(
                { userId: user._id, role: user.role },
                refreshSecret,
                { expiresIn: '7d' }
            );
        } catch (jwtError) {
            throw jwtError;
        }

        res.cookie('token', token, { 
            httpOnly: true, 
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax'
        });
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/api/auth/refresh-token'
        });
        return res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user: {
                _id: user._id,
                role: user.role
            }
        });
    } catch (e) {
        res.status(500).json({
            success: false,
            message: "Error occurred while logging in",
            error: e.message
        });
    }
};

const authMiddleware = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Unauthorized user'
        });
    }
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        return next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Unauthorized user'
        });
    }
};

const logoutUser = (req, res) => {
    res.clearCookie('token');
    return res.status(200).json({
        success: true,
        message: "Logout successful"
    });
};

const refreshToken = (req, res) => {
    const token = req.cookies.refreshToken;
    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'No refresh token provided'
        });
    }
    try {
        const refreshSecret = process.env.JWT_REFRESH_SECRET || 'your_jwt_refresh_secret';
        const decoded = jwt.verify(token, refreshSecret);
        const newToken = jwt.sign(
            { userId: decoded.userId, role: decoded.role },
            process.env.JWT_SECRET,
            { expiresIn: '15m' }
        );
        res.cookie('token', newToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax'
        });
        return res.status(200).json({
            success: true,
            message: 'Token refreshed',
            token: newToken
        });
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Invalid refresh token'
        });
    }
};

const getUserProfile = async (req, res) => {
    const userId = req.params.userId;
    try {
        const user = await User.findById(userId).select('-password');
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching user profile',
            error: error.message
        });
    }
};

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    authMiddleware,
    refreshToken,
    getUserProfile
};
