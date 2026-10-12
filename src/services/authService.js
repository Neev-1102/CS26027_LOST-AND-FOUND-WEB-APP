import api from './api';
import { INITIAL_USERS } from '../data/mockData';

const getMockUsers = () => {
  const saved = localStorage.getItem('campusfind_mock_users');
  return saved ? JSON.parse(saved) : INITIAL_USERS;
};

export const authService = {
  login: async (email, password, role) => {
    try {
      const response = await api.post('/auth/login', { email, password, role });
      const authData = response.data;
      if (authData.token) {
        localStorage.setItem('campusfind_token', authData.token);
        localStorage.setItem('campusfind_user', JSON.stringify(authData.user));
      }
      return authData;
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        throw new Error(err.response.data.message);
      }

      // Mock Fallback
      const users = getMockUsers();
      const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

      if (!user) {
        throw new Error('Invalid college email or password');
      }

      const userRole = user.role === 'faculty' ? 'staff' : user.role;
      const requestedRole = role === 'faculty' ? 'staff' : role;
      if (role && userRole !== requestedRole) {
        throw new Error(`Role mismatch: Registered as '${user.role.toUpperCase()}', but '${role.toUpperCase()}' was selected.`);
      }

      const mockToken = 'mock_jwt_token_' + Math.random().toString(36).substring(2);
      const authData = { user, token: mockToken };

      localStorage.setItem('campusfind_token', mockToken);
      localStorage.setItem('campusfind_user', JSON.stringify(user));
      return authData;
    }
  },

  loginWithGoogle: async (googleData) => {
    try {
      const response = await api.post('/auth/google', googleData);
      const authData = response.data;
      if (authData.token) {
        localStorage.setItem('campusfind_token', authData.token);
        localStorage.setItem('campusfind_user', JSON.stringify(authData.user));
      }
      return authData;
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        throw new Error(err.response.data.message);
      }
      const googleUser = {
        id: 'usr_g_' + Date.now(),
        name: googleData.name || googleData.email.split('@')[0],
        email: googleData.email,
        role: googleData.role || 'student',
        studentId: googleData.email.split('@')[0].toUpperCase(),
        department: 'Google Authenticated User',
        status: 'Active',
        avatar: googleData.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=300',
      };
      const mockToken = 'mock_jwt_token_google_' + Date.now();
      localStorage.setItem('campusfind_token', mockToken);
      localStorage.setItem('campusfind_user', JSON.stringify(googleUser));
      return { user: googleUser, token: mockToken };
    }
  },

  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      const authData = response.data;
      if (authData.token) {
        localStorage.setItem('campusfind_token', authData.token);
        localStorage.setItem('campusfind_user', JSON.stringify(authData.user));
      }
      return authData;
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        throw new Error(err.response.data.message);
      }

      const users = getMockUsers();
      if (users.some((u) => u.email.toLowerCase() === userData.email.toLowerCase())) {
        throw new Error('An account with this email already exists.');
      }

      const newUser = {
        id: 'usr_' + Date.now(),
        name: userData.name,
        email: userData.email,
        role: 'student',
        studentId: userData.studentId || userData.collegeId || 'STU-' + Math.floor(1000 + Math.random() * 9000),
        department: userData.department || 'General Studies',
        status: 'Active',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=300',
        createdAt: new Date().toISOString(),
      };

      users.push(newUser);
      localStorage.setItem('campusfind_mock_users', JSON.stringify(users));

      const mockToken = 'mock_jwt_token_reg_' + Date.now();
      localStorage.setItem('campusfind_token', mockToken);
      localStorage.setItem('campusfind_user', JSON.stringify(newUser));

      return { user: newUser, token: mockToken };
    }
  },

  getCurrentUser: async () => {
    try {
      const response = await api.get('/auth/me');
      if (response.data?.user) {
        localStorage.setItem('campusfind_user', JSON.stringify(response.data.user));
        return response.data.user;
      }
    } catch {
      const saved = localStorage.getItem('campusfind_user');
      return saved ? JSON.parse(saved) : null;
    }
  },

  updateProfile: async (profileData) => {
    try {
      const response = await api.patch('/auth/profile', profileData);
      if (response.data?.user) {
        localStorage.setItem('campusfind_user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (err) {
      if (err.response?.data?.message) throw new Error(err.response.data.message);
      const user = JSON.parse(localStorage.getItem('campusfind_user') || '{}');
      const updated = { ...user, ...profileData };
      localStorage.setItem('campusfind_user', JSON.stringify(updated));
      return { success: true, user: updated };
    }
  },

  changePassword: async (currentPassword, newPassword) => {
    try {
      const response = await api.post('/auth/change-password', { currentPassword, newPassword });
      return response.data;
    } catch (err) {
      if (err.response?.data?.message) throw new Error(err.response.data.message);
      return { success: true, message: 'Password updated.' };
    }
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // Ignored
    } finally {
      localStorage.removeItem('campusfind_token');
      localStorage.removeItem('campusfind_user');
    }
  },
};
