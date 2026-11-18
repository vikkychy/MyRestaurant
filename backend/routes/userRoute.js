import express from 'express';

import {
    registerUser,
    loginUser,
    logoutUser
} from '../controllers/userController.js';

import { isAuthenticated } from '../middlewares/authMiddleware.js';

const router = express.Router();

// User Registration
router.post('/register', registerUser);

// User Login
router.post('/login', loginUser);

// User Logout
router.post('/logout', logoutUser);

// Get Logged-in User
router.get('/me', isAuthenticated, (req, res) => {
    res.status(200).json({
        success: true,
        user: req.user
    });
});

export default router;3
