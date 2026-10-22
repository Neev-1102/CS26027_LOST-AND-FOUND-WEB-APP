import express from 'express';
import {
  getDashboardStats,
  getAllUsers,
  createStaffAccount,
  updateUser,
  deleteUser,
  getAuditLogs,
  getAnalytics,
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/adminController.js';
import { authenticate } from '../middleware/authenticate.js';
import { authorizeRole } from '../middleware/authorizeRole.js';

const router = express.Router();

router.use(authenticate);

// Staff & Admin can view audit logs
router.get('/audit-logs', authorizeRole('admin', 'staff'), getAuditLogs);

// Any authenticated user can view categories for item reporting
router.get('/categories', getAllCategories);

// Strict Admin-only management endpoints
router.use(authorizeRole('admin'));

router.get('/dashboard', getDashboardStats);
router.get('/users', getAllUsers);
router.post('/staff', createStaffAccount);
router.patch('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

router.get('/analytics', getAnalytics);

// Admin Category Management
router.post('/categories', createCategory);
router.patch('/categories/:id', updateCategory);
router.delete('/categories/:id', deleteCategory);

export default router;
