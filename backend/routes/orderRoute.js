import express from 'express';
import {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus
} from '../controllers/orderController.js';

import { isAuthenticated, authorizeRoles } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Customer routes
router.post('/new', isAuthenticated, createOrder);
router.get('/myorders', isAuthenticated, getMyOrders);

// Admin routes
router.get('/admin/orders', isAuthenticated, authorizeRoles('admin', 'superadmin'), getAllOrders);

router.put('/admin/orders/:id', isAuthenticated, authorizeRoles('admin', 'superadmin'), updateOrderStatus);

export default router;