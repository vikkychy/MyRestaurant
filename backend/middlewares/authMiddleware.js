import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

// Authenticate User
export const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Please login to access this resource'
            });
        }

        const decodedData = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.user = await User.findById(decodedData.id);

        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'User not found'
            });
        }

        next();

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Invalid or expired token'
        });
    }
};


// Authorize User Roles
export const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: 'You are not allowed to access this resource'
            });
        }

        next();
    };
};