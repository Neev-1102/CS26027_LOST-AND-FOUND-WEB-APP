import express from 'express';
import {
  submitClaim,
  getMyClaims,
  getClaimById,
  getStaffClaims,
  reviewClaim,
  confirmHandover,
} from '../controllers/claimController.js';
import { authenticate } from '../middleware/authenticate.js';
import { authorizeRole } from '../middleware/authorizeRole.js';

const router = express.Router();

// Student endpoints
router.post('/', authenticate, submitClaim);
router.get('/my', authenticate, getMyClaims);
router.get('/:id', authenticate, getClaimById);

// Staff and Admin review & handover endpoints
router.get('/', authenticate, authorizeRole('staff', 'admin'), getStaffClaims);
router.get('/staff/all', authenticate, authorizeRole('staff', 'admin'), getStaffClaims);
router.patch('/:id/status', authenticate, authorizeRole('staff', 'admin'), reviewClaim);
router.patch('/:id/review', authenticate, authorizeRole('staff', 'admin'), reviewClaim);
router.patch('/staff/:id/review', authenticate, authorizeRole('staff', 'admin'), reviewClaim);
router.patch('/:id/handover', authenticate, authorizeRole('staff', 'admin'), confirmHandover);
router.patch('/staff/:id/handover', authenticate, authorizeRole('staff', 'admin'), confirmHandover);

export default router;
