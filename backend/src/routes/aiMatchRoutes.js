import express from 'express';
import {
  searchAIMatches,
  getMatchesForLostItem,
  getAIMatchHistory,
  getAIMatchById,
} from '../controllers/aiMatchController.js';

const router = express.Router();

router.post('/search', searchAIMatches);
router.post('/match', searchAIMatches);
router.get('/history', getAIMatchHistory);
router.get('/lost/:id', getMatchesForLostItem);
router.get('/:id', getAIMatchById);

export default router;
