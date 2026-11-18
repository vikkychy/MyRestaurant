import express from 'express';

import {
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory
} from '../controllers/categoryController.js';

import {
    isAuthenticated,
    authorizeRoles
} from '../middlewares/authMiddleware.js';

const router = express.Router();

// Get all categories - Public
router.get('/', getCategories);

// Admin category management
router.post('/', isAuthenticated, authorizeRoles('admin', 'superadmin'), createCategory);

router.put('/:id', isAuthenticated, authorizeRoles('admin', 'superadmin'), updateCategory);

router.delete('/:id', isAuthenticated, authorizeRoles('admin', 'superadmin'), deleteCategory);

export default router;