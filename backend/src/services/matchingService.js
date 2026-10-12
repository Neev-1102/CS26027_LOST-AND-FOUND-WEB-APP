import FoundItem from '../models/FoundItem.js';

export const findPossibleMatches = async (lostItem) => {
  // Find found items that are in custody or approved for handover (not returned or archived)
  const candidateItems = await FoundItem.find({
    status: { $in: ['in_custody', 'claim_pending', 'approved_for_handover'] },
  }).lean();

  const results = [];

  const lostWords = (lostItem.itemName + ' ' + (lostItem.description || '')).toLowerCase().split(/\W+/).filter(Boolean);
  const lostColor = (lostItem.color || '').toLowerCase().trim();
  const lostBrand = (lostItem.brand || '').toLowerCase().trim();
  const lostCategory = (lostItem.category || '').toLowerCase().trim();

  for (const item of candidateItems) {
    let score = 0;
    const factors = [];

    // 1. Category comparison (30 pts)
    const foundCategory = (item.category || '').toLowerCase().trim();
    if (lostCategory && foundCategory && lostCategory === foundCategory) {
      score += 30;
      factors.push({ factor: 'Category Match', match: true, weight: 30, detail: item.category });
    }

    // 2. Keyword & Title overlap (25 pts)
    const foundWords = (item.internalItemName + ' ' + (item.internalDescription || '')).toLowerCase().split(/\W+/).filter(Boolean);
    const commonWords = lostWords.filter((w) => w.length > 2 && foundWords.includes(w));
    if (commonWords.length > 0) {
      const keywordScore = Math.min(25, commonWords.length * 8);
      score += keywordScore;
      factors.push({ factor: 'Keyword Overlap', match: true, weight: keywordScore, detail: `${commonWords.slice(0, 3).join(', ')}` });
    }

    // 3. Color comparison (20 pts)
    const foundColor = (item.color || '').toLowerCase().trim();
    if (lostColor && foundColor && (lostColor.includes(foundColor) || foundColor.includes(lostColor))) {
      score += 20;
      factors.push({ factor: 'Color Match', match: true, weight: 20, detail: item.color });
    }

    // 4. Brand comparison (15 pts)
    const foundBrand = (item.brand || '').toLowerCase().trim();
    if (lostBrand && foundBrand && (lostBrand.includes(foundBrand) || foundBrand.includes(lostBrand))) {
      score += 15;
      factors.push({ factor: 'Brand Match', match: true, weight: 15, detail: item.brand });
    }

    // 5. Date proximity (10 pts)
    if (lostItem.dateLost && item.dateFound) {
      const diffDays = Math.abs((new Date(item.dateFound) - new Date(lostItem.dateLost)) / (1000 * 60 * 60 * 24));
      if (diffDays <= 7) {
        const dateScore = Math.max(2, Math.round(10 - diffDays));
        score += dateScore;
        factors.push({ factor: 'Date Proximity', match: true, weight: dateScore, detail: `Found within ${Math.round(diffDays)} day(s)` });
      }
    }

    if (score >= 20) {
      // Redact private storageLocation from candidate output
      const { storageLocation, ...safeItem } = item;
      results.push({
        foundItem: safeItem,
        matchScore: Math.min(99, score),
        confidence: score >= 75 ? 'High' : score >= 50 ? 'Medium' : 'Low',
        factors,
      });
    }
  }

  // Sort by highest score first
  results.sort((a, b) => b.matchScore - a.matchScore);
  return results;
};
