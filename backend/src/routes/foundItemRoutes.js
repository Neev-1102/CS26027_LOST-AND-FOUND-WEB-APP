import express from 'express';
import {
  createFoundItem,
  getAllFoundItems,
  getFoundItemById,
  updateFoundItem,
  deleteFoundItem,
} from '../controllers/foundItemController.js';
import { authenticate } from '../middleware/authenticate.js';
import { authorizeRole } from '../middleware/authorizeRole.js';

const router = express.Router();

const optionalAuth = async (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    return authenticate(req, res, next);
  }
  next();
};

// Authenticated users (Students reporting found property, Staff/Admin registering custody)
router.post('/', authenticate, createFoundItem);

// Anyone can view found items, but non-staff get redacted results (no storageLocation)
router.get('/', optionalAuth, getAllFoundItems);
router.get('/:id', optionalAuth, getFoundItemById);

// Staff and Admin can update found items
router.patch('/:id', authenticate, authorizeRole('staff', 'admin'), updateFoundItem);

// Admin only can delete found items
router.delete('/:id', authenticate, authorizeRole('admin'), deleteFoundItem);

export default router;
