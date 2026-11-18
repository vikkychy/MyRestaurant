import express from 'express';
import {
  getMyPayments,
  getAllPayments,
  updatePaymentStatus
} from '../controllers/paymentController.js';

import {
  isAuthenticated,
  authorizeRoles
} from '../middlewares/authMiddleware.js';

const router = express.Router();

// Customer payment routes
router.get('/my-payments', isAuthenticated, getMyPayments);

// Admin payment routes
router.get(
  '/admin/payments',
  isAuthenticated,
  authorizeRoles('admin', 'superadmin'),
  getAllPayments
);

router.put(
  '/admin/payments/:id',
  isAuthenticated,
  authorizeRoles('admin', 'superadmin'),
  updatePaymentStatus
);

export default router;