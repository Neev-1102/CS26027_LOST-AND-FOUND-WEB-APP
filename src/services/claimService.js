import api from './api';
import { INITIAL_CLAIMS } from '../data/mockData';

const getMockClaims = () => {
  const saved = localStorage.getItem('campusfind_claims');
  return saved ? JSON.parse(saved) : INITIAL_CLAIMS;
};

const saveMockClaims = (claims) => {
  localStorage.setItem('campusfind_claims', JSON.stringify(claims));
};

export const claimService = {
  submitClaim: async (claimData) => {
    try {
      const response = await api.post('/claims', claimData);
      return response.data;
    } catch (err) {
      if (err.response?.data?.message) throw new Error(err.response.data.message);
      const claims = getMockClaims();
      const user = JSON.parse(localStorage.getItem('campusfind_user') || '{}');

      const newClaim = {
        _id: 'clm_' + Date.now(),
        id: 'clm_' + Date.now(),
        foundItem: {
          _id: claimData.foundItemId,
          id: claimData.foundItemId,
          internalItemName: 'Claimed Property',
          title: 'Claimed Property',
        },
        claimant: user,
        explanation: claimData.explanation,
        identifyingEvidence: claimData.identifyingEvidence,
        proofFiles: claimData.proofFiles || [],
        status: 'pending',
        createdAt: new Date().toISOString(),
      };

      claims.unshift(newClaim);
      saveMockClaims(claims);
      return { success: true, claim: newClaim };
    }
  },

  getMyClaims: async () => {
    try {
      const response = await api.get('/claims/my');
      return response.data;
    } catch {
      const user = JSON.parse(localStorage.getItem('campusfind_user') || '{}');
      const claims = getMockClaims().filter(
        (c) => c.claimant?._id === user.id || c.claimant?.email === user.email || c.claimantId === user.id
      );
      return { claims, total: claims.length };
    }
  },

  getById: async (id) => {
    try {
      const response = await api.get(`/claims/${id}`);
      return response.data;
    } catch {
      const claims = getMockClaims();
      const claim = claims.find((c) => (c._id || c.id).toString() === id.toString());
      if (!claim) throw new Error('Claim record not found');
      return { claim };
    }
  },

  getStaffClaims: async (params = {}) => {
    try {
      const response = await api.get('/claims/staff/all', { params });
      return response.data;
    } catch {
      const claims = getMockClaims();
      return { claims, total: claims.length };
    }
  },

  reviewClaim: async (claimId, { status, reviewRemark }) => {
    try {
      const response = await api.patch(`/claims/staff/${claimId}/review`, { status, reviewRemark });
      return response.data;
    } catch (err) {
      if (err.response?.data?.message) throw new Error(err.response.data.message);
      const claims = getMockClaims();
      const index = claims.findIndex((c) => (c._id || c.id).toString() === claimId.toString());
      if (index === -1) throw new Error('Claim not found');

      claims[index].status = status;
      claims[index].reviewRemark = reviewRemark || '';
      claims[index].reviewedAt = new Date().toISOString();
      saveMockClaims(claims);
      return { success: true, claim: claims[index] };
    }
  },

  confirmHandover: async (claimId, { handoverNotes }) => {
    try {
      const response = await api.patch(`/claims/staff/${claimId}/handover`, { handoverNotes });
      return response.data;
    } catch (err) {
      if (err.response?.data?.message) throw new Error(err.response.data.message);
      const claims = getMockClaims();
      const index = claims.findIndex((c) => (c._id || c.id).toString() === claimId.toString());
      if (index === -1) throw new Error('Claim not found');

      claims[index].status = 'completed';
      claims[index].handoverConfirmedAt = new Date().toISOString();
      saveMockClaims(claims);
      return { success: true, claim: claims[index] };
    }
  },
};
