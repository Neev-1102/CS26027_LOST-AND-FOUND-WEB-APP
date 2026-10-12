import express from 'express';
import {
  createLostItem,
  getMyLostItems,
  getAllLostItems,
  getLostItemById,
  updateLostItem,
  deleteLostItem,
  getPossibleMatches,
} from '../controllers/lostItemController.js';
import { authenticate } from '../middleware/authenticate.js';

const router = express.Router();

// Optional auth for public viewing
const optionalAuth = async (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    return authenticate(req, res, next);
  }
  next();
};

router.post('/', authenticate, createLostItem);
router.get('/my', authenticate, getMyLostItems);
router.get('/', optionalAuth, getAllLostItems);
router.get('/:id', optionalAuth, getLostItemById);
router.patch('/:id', authenticate, updateLostItem);
router.delete('/:id', authenticate, deleteLostItem);
router.get('/:id/matches', authenticate, getPossibleMatches);

export default router;
