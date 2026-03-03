const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            token = req.headers.authorization.split(' ')[1];

            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key_here');

            req.user = await User.findById(decoded.id).select('-password');

            next();
        } catch (error) {
            console.error('Auth Middleware Error:', error);
            return res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }
};

const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                message: `User role ${req.user.role} is not authorized to access this route`
            });
        }
        next();
    };
};

const checkApproved = (req, res, next) => {
    if (req.user.role === 'teacher' && req.user.status !== 'approved') {
        return res.status(403).json({
            message: `Your account is ${req.user.status}. Access denied until admin approves.`,
            status: req.user.status
        });
    }
    next();
};

module.exports = { protect, authorize, checkApproved };
