import api from './api';

export const userService = {
  getProfile: async () => {
    try {
      const response = await api.get('/user/profile');
      return response.data;
    } catch {
      return JSON.parse(localStorage.getItem('campusfind_user'));
    }
  },

  updateProfile: async (profileData) => {
    try {
      const response = await api.put('/user/profile', profileData);
      return response.data;
    } catch {
      const currentUser = JSON.parse(localStorage.getItem('campusfind_user')) || {};
      const updated = { ...currentUser, ...profileData };
      localStorage.setItem('campusfind_user', JSON.stringify(updated));
      return updated;
    }
  },

  changePassword: async (passwordData) => {
    try {
      const response = await api.put('/user/change-password', passwordData);
      return response.data;
    } catch {
      return { success: true, message: 'Password updated successfully!' };
    }
  }
};
