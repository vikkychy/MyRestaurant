import express from 'express';

import {
    getFoods,
    getSingleFood,
    createFood,
    updateFood,
    deleteFood
} from '../controllers/foodController.js';

import {
    isAuthenticated,
    authorizeRoles
} from '../middlewares/authMiddleware.js';

const router = express.Router();

// Get all food items - Public
router.get('/', getFoods);

// Get single food item - Public
router.get('/:id', getSingleFood);

// Create food - Admin only
router.post(
    '/',
    isAuthenticated,
    authorizeRoles('admin', 'superadmin'),
    createFood
);

// Update food - Admin only
router.put(
    '/:id',
    isAuthenticated,
    authorizeRoles('admin', 'superadmin'),
    updateFood
);

// Delete food - Admin only
router.delete(
    '/:id',
    isAuthenticated,
    authorizeRoles('admin', 'superadmin'),
    deleteFood
);

export default router;