import api from './api';
import { INITIAL_USERS, CATEGORIES } from '../data/mockData';

const getMockUsers = () => {
  const saved = localStorage.getItem('campusfind_mock_users');
  return saved ? JSON.parse(saved) : INITIAL_USERS;
};

const saveMockUsers = (users) => {
  localStorage.setItem('campusfind_mock_users', JSON.stringify(users));
};

export const adminService = {
  getStats: async () => {
    try {
      const response = await api.get('/admin/dashboard');
      return response.data;
    } catch {
      return {
        stats: {
          totalUsers: 142,
          totalLost: 88,
          totalFound: 64,
          totalClaims: 39,
          returnedCount: 28,
          recoveryRate: 44,
          recentAuditLogs: [],
        },
      };
    }
  },

  getUsers: async (params = {}) => {
    try {
      const response = await api.get('/admin/users', { params });
      return response.data;
    } catch {
      let users = getMockUsers();
      if (params.role && params.role !== 'all') {
        users = users.filter((u) => u.role === params.role);
      }
      if (params.status && params.status !== 'all') {
        users = users.filter((u) => u.status === params.status);
      }
      return { users, total: users.length };
    }
  },

  createStaff: async (staffData) => {
    try {
      const response = await api.post('/admin/staff', staffData);
      return response.data;
    } catch (err) {
      if (err.response?.data?.message) throw new Error(err.response.data.message);
      const users = getMockUsers();
      const newStaff = {
        _id: 'usr_stf_' + Date.now(),
        id: 'usr_stf_' + Date.now(),
        name: staffData.name,
        email: staffData.email,
        role: 'staff',
        department: staffData.department || 'Campus Security & Lost Property Desk',
        status: 'Active',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300',
        createdAt: new Date().toISOString(),
      };
      users.unshift(newStaff);
      saveMockUsers(users);
      return { success: true, user: newStaff };
    }
  },

  updateUser: async (id, userData) => {
    try {
      const response = await api.patch(`/admin/users/${id}`, userData);
      return response.data;
    } catch (err) {
      if (err.response?.data?.message) throw new Error(err.response.data.message);
      const users = getMockUsers();
      const idx = users.findIndex((u) => (u._id || u.id).toString() === id.toString());
      if (idx !== -1) {
        users[idx] = { ...users[idx], ...userData };
        saveMockUsers(users);
      }
      return { success: true, user: users[idx] };
    }
  },

  deleteUser: async (id) => {
    try {
      const response = await api.delete(`/admin/users/${id}`);
      return response.data;
    } catch (err) {
      if (err.response?.data?.message) throw new Error(err.response.data.message);
      const users = getMockUsers().filter((u) => (u._id || u.id).toString() !== id.toString());
      saveMockUsers(users);
      return { success: true };
    }
  },

  getAuditLogs: async (params = {}) => {
    try {
      const response = await api.get('/admin/audit-logs', { params });
      return response.data;
    } catch {
      return { total: 0, logs: [] };
    }
  },

  getAnalytics: async () => {
    try {
      const response = await api.get('/admin/analytics');
      return response.data;
    } catch {
      return {
        categoryCounts: [
          { _id: 'Electronics', count: 42 },
          { _id: 'ID Cards', count: 35 },
          { _id: 'Keys & Fobs', count: 18 },
          { _id: 'Bags & Backpacks', count: 14 },
          { _id: 'Accessories', count: 11 },
        ],
        monthlyTrends: [
          { _id: '2026-06', foundCount: 12, returnedCount: 5 },
          { _id: '2026-07', foundCount: 18, returnedCount: 9 },
          { _id: '2026-08', foundCount: 25, returnedCount: 14 },
          { _id: '2026-09', foundCount: 22, returnedCount: 12 },
          { _id: '2026-10', foundCount: 30, returnedCount: 18 },
        ],
      };
    }
  },

  getCategories: async () => {
    try {
      const response = await api.get('/admin/categories');
      return response.data;
    } catch {
      return { categories: CATEGORIES };
    }
  },

  createCategory: async (categoryData) => {
    try {
      const response = await api.post('/admin/categories', categoryData);
      return response.data;
    } catch (err) {
      if (err.response?.data?.message) throw new Error(err.response.data.message);
      return { success: true, category: { ...categoryData, _id: 'cat_' + Date.now() } };
    }
  },

  updateCategory: async (id, categoryData) => {
    try {
      const response = await api.patch(`/admin/categories/${id}`, categoryData);
      return response.data;
    } catch (err) {
      if (err.response?.data?.message) throw new Error(err.response.data.message);
      return { success: true, category: categoryData };
    }
  },

  deleteCategory: async (id) => {
    try {
      const response = await api.delete(`/admin/categories/${id}`);
      return response.data;
    } catch (err) {
      if (err.response?.data?.message) throw new Error(err.response.data.message);
      return { success: true };
    }
  },
};
