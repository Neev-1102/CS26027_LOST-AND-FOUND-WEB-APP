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

// Strict Admin-only middleware applied to all routes in this router
router.use(authenticate, authorizeRole('admin'));

router.get('/dashboard', getDashboardStats);
router.get('/users', getAllUsers);
router.post('/staff', createStaffAccount);
router.patch('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

router.get('/audit-logs', getAuditLogs);
router.get('/analytics', getAnalytics);

// Category Management
router.get('/categories', getAllCategories);
router.post('/categories', createCategory);
router.patch('/categories/:id', updateCategory);
router.delete('/categories/:id', deleteCategory);

export default router;
