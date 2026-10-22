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
        avatar: null,
        createdAt: new Date().toISOString(),
      };
      users.unshift(newStaff);
      saveMockUsers(users);
      return { success: true, user: newStaff };
    }
  },

  updateUser: async (id, userData) => {
    try {
      const response = await api.post ? await api.patch(`/admin/users/${id}`, userData) : await api.patch(`/admin/users/${id}`, userData);
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

  updateUserStatus: async (id, status) => {
    const accountStatus = status.toLowerCase() === 'active' ? 'active' : 'inactive';
    return adminService.updateUser(id, { accountStatus });
  },

  updateUserRole: async (id, role) => {
    const targetRole = role.toLowerCase() === 'faculty' ? 'staff' : role.toLowerCase();
    return adminService.updateUser(id, { role: targetRole });
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
        categoryCounts: [],
        byCategory: [],
        lostVsFound: [],
        monthlyTrends: [],
      };
    }
  },

  getCategories: async () => {
    try {
      const response = await api.get('/admin/categories');
      return response.data?.categories || response.data || [];
    } catch {
      return CATEGORIES;
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
