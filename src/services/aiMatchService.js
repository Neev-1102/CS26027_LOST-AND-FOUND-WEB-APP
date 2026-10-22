import api from './api';
import { INITIAL_AI_MATCHES } from '../data/mockAIMatches';

/**
 * AI Match Service
 * 
 * NOTE FOR FUTURE BACKEND INTEGRATION:
 * This service is prepared to connect with the future backend AI pipeline:
 * [Image Upload] 
 *   → [Backend / Multer]
 *   → [Image Preprocessing & Resizing]
 *   → [Object Detection (YOLO / Vision Model)]
 *   → [Visual Feature Extraction & Embedding]
 *   → [Cosine Similarity Search against vector index of found items]
 *   → [Composite Scoring (Visual, Color, Category, Proximity, Date)]
 *   → [Ranked Recommendations to Frontend]
 * 
 * For now, this service simulates the pipeline using mock datasets and timed responses.
 */

const STORAGE_KEY = 'campusfind_ai_matches';

const getStoredMatches = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_AI_MATCHES));
    return INITIAL_AI_MATCHES;
  }
  try {
    return JSON.parse(data);
  } catch {
    return INITIAL_AI_MATCHES;
  }
};

const saveMatches = (matches) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(matches));
};

export const aiMatchService = {
  /**
   * Find AI matches for a given item or image preview
   * @param {string} itemId - The lost or found item ID
   * @param {Object} options - Search configuration or image metadata
   */
  async findAIMatches(itemId, options = {}) {
    try {
      const response = await api.post('/ai-matches/search', { itemId, ...options });
      if (response.data?.matches) return response.data.matches;
      if (Array.isArray(response.data)) return response.data;
    } catch (err) {
      console.warn('Backend AI match query error:', err.message);
    }

    const allMatches = getStoredMatches();
    if (!itemId) return allMatches.slice(0, 8);
    const matched = allMatches.filter((m) => m.lostItemId === itemId || m.foundItemId === itemId);
    return matched.length > 0 ? matched : allMatches.slice(0, 4);
  },

  async getAIMatch(matchId) {
    try {
      const response = await api.get(`/ai-matches/${matchId}`);
      if (response.data?.match) return response.data.match;
    } catch (err) {
      console.warn('Backend AI match query error:', err.message);
    }

    const allMatches = getStoredMatches();
    const match = allMatches.find((m) => m.id === matchId);
    return match || allMatches[0] || null;
  },

  async getMatchesByLostItem(lostItemId) {
    try {
      const response = await api.get(`/ai-matches/lost/${lostItemId}`);
      if (response.data?.matches) return response.data.matches;
    } catch (err) {
      console.warn('Backend AI matches by lost item error:', err.message);
    }

    const allMatches = getStoredMatches();
    const results = allMatches.filter((m) => m.lostItemId === lostItemId);
    return results.length > 0 ? results : allMatches.slice(0, 3);
  },

  async getMatchHistory() {
    try {
      const response = await api.get('/ai-matches/history');
      if (response.data?.matches) return response.data.matches;
    } catch (err) {
      console.warn('Backend AI match history error:', err.message);
    }

    return getStoredMatches();
  },

  /**
   * Record a new simulated AI scan result
   */
  async recordScanResult(scanData) {
    const allMatches = getStoredMatches();
    const newMatch = {
      id: `match-${Date.now().toString().slice(-4)}`,
      createdAt: new Date().toISOString(),
      ...scanData
    };
    const updated = [newMatch, ...allMatches];
    saveMatches(updated);
    return newMatch;
  }
};

export default aiMatchService;
