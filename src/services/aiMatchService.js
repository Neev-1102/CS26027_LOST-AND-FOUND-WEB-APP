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
    // Check if backend API URL is configured
    if (import.meta.env.VITE_API_URL) {
      try {
        const response = await api.post('/ai-matches/search', { itemId, ...options });
        return response.data;
      } catch (err) {
        console.warn('Backend AI service unavailable, falling back to mock engine:', err.message);
      }
    }

    // Mock processing simulation
    await new Promise((resolve) => setTimeout(resolve, 800));
    const allMatches = getStoredMatches();
    
    if (!itemId) {
      return allMatches.slice(0, 8);
    }

    const matched = allMatches.filter(
      (m) => m.lostItemId === itemId || m.foundItemId === itemId
    );

    return matched.length > 0 ? matched : allMatches.slice(0, 4);
  },

  /**
   * Get single AI match analysis by ID
   * @param {string} matchId
   */
  async getAIMatch(matchId) {
    if (import.meta.env.VITE_API_URL) {
      try {
        const response = await api.get(`/ai-matches/${matchId}`);
        return response.data;
      } catch (err) {
        console.warn('Backend AI service unavailable, falling back to mock:', err.message);
      }
    }

    await new Promise((resolve) => setTimeout(resolve, 400));
    const allMatches = getStoredMatches();
    const match = allMatches.find((m) => m.id === matchId);
    if (!match) {
      // Fallback return first item or construct simulated match
      return allMatches[0] || null;
    }
    return match;
  },

  /**
   * Get matches specific to a lost item
   * @param {string} lostItemId
   */
  async getMatchesByLostItem(lostItemId) {
    if (import.meta.env.VITE_API_URL) {
      try {
        const response = await api.get(`/ai-matches/lost/${lostItemId}`);
        return response.data;
      } catch (err) {
        console.warn('Backend AI service unavailable, falling back to mock:', err.message);
      }
    }

    await new Promise((resolve) => setTimeout(resolve, 300));
    const allMatches = getStoredMatches();
    const results = allMatches.filter((m) => m.lostItemId === lostItemId);
    return results.length > 0 ? results : allMatches.slice(0, 3);
  },

  /**
   * Get AI scan and match history
   */
  async getMatchHistory() {
    if (import.meta.env.VITE_API_URL) {
      try {
        const response = await api.get('/ai-matches/history');
        return response.data;
      } catch (err) {
        console.warn('Backend AI service unavailable, falling back to mock:', err.message);
      }
    }

    await new Promise((resolve) => setTimeout(resolve, 300));
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
