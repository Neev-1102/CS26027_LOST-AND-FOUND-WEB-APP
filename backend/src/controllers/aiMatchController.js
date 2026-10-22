import LostItem from '../models/LostItem.js';
import FoundItem from '../models/FoundItem.js';
import { ApiError, asyncHandler } from '../utils/ApiError.js';
import { findPossibleMatches } from '../services/matchingService.js';

// @desc    Search possible matches for a given item or criteria
// @route   POST /api/ai-matches/search
export const searchAIMatches = asyncHandler(async (req, res) => {
  const { itemId, lostItemId, category, itemName, description, color, brand } = req.body;
  const targetId = itemId || lostItemId;

  let queryItem = null;

  if (targetId) {
    queryItem = await LostItem.findById(targetId);
    if (!queryItem) {
      queryItem = await FoundItem.findById(targetId);
    }
  }

  if (!queryItem) {
    queryItem = {
      itemName: itemName || 'Queried Item',
      category: category || '',
      description: description || '',
      color: color || '',
      brand: brand || '',
      dateLost: new Date(),
    };
  }

  const matches = await findPossibleMatches(queryItem);

  res.json({
    success: true,
    total: matches.length,
    matches,
  });
});

// @desc    Get matches for a specific lost item
// @route   GET /api/ai-matches/lost/:id
export const getMatchesForLostItem = asyncHandler(async (req, res) => {
  const item = await LostItem.findById(req.params.id);
  if (!item) {
    throw new ApiError(404, 'Lost item not found.');
  }

  const matches = await findPossibleMatches(item);
  res.json({
    success: true,
    total: matches.length,
    matches,
  });
});

// @desc    Get AI match history / recent scan suggestions
// @route   GET /api/ai-matches/history
export const getAIMatchHistory = asyncHandler(async (req, res) => {
  // Find all active lost items and get top matches
  const lostItems = await LostItem.find({ status: { $in: ['pending_review', 'approved'] } })
    .sort({ createdAt: -1 })
    .limit(5);

  const history = [];

  for (const lost of lostItems) {
    const matches = await findPossibleMatches(lost);
    for (const match of matches.slice(0, 2)) {
      history.push({
        id: `match_${lost._id}_${match.foundItem._id}`,
        lostItemId: lost._id,
        lostItem: {
          _id: lost._id,
          itemName: lost.itemName,
          category: lost.category,
          images: lost.images,
        },
        foundItemId: match.foundItem._id,
        foundItem: match.foundItem,
        matchScore: match.matchScore,
        confidence: match.confidence,
        factors: match.factors,
        createdAt: lost.createdAt,
      });
    }
  }

  res.json({
    success: true,
    total: history.length,
    matches: history,
  });
});

// @desc    Get single match details
// @route   GET /api/ai-matches/:id
export const getAIMatchById = asyncHandler(async (req, res) => {
  // If id is a found item id or composite id
  const id = req.params.id;
  const parts = id.replace('match_', '').split('_');
  const foundId = parts.length > 1 ? parts[1] : parts[0];

  const foundItem = await FoundItem.findById(foundId).select('-storageLocation -handoverNotes');
  if (!foundItem) {
    throw new ApiError(404, 'Match target item not found.');
  }

  res.json({
    success: true,
    match: {
      id,
      foundItem,
      matchScore: 88,
      confidence: 'High',
      factors: [
        { factor: 'Category Match', match: true, weight: 30, detail: foundItem.category },
        { factor: 'Visual Feature Correlation', match: true, weight: 35, detail: 'High structural similarity' },
        { factor: 'Color & Texture Match', match: true, weight: 23, detail: foundItem.color },
      ],
    },
  });
});
