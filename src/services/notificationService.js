import api from './api';
import { INITIAL_NOTIFICATIONS } from '../data/mockData';

const getMockNotifications = () => {
  const saved = localStorage.getItem('campusfind_notifications');
  return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
};

const saveMockNotifications = (notifications) => {
  localStorage.setItem('campusfind_notifications', JSON.stringify(notifications));
};

export const notificationService = {
  getAll: async () => {
    try {
      const response = await api.get('/notifications');
      return response.data;
    } catch {
      const notifications = getMockNotifications();
      const unreadCount = notifications.filter((n) => !n.isRead).length;
      return { notifications, unreadCount, total: notifications.length };
    }
  },

  markAsRead: async (id) => {
    try {
      const response = await api.patch(`/notifications/${id}/read`);
      return response.data;
    } catch {
      const notifications = getMockNotifications();
      const index = notifications.findIndex((n) => (n._id || n.id).toString() === id.toString());
      if (index !== -1) {
        notifications[index].isRead = true;
        saveMockNotifications(notifications);
      }
      return { success: true };
    }
  },

  markAllAsRead: async () => {
    try {
      const response = await api.patch('/notifications/read-all');
      return response.data;
    } catch {
      const notifications = getMockNotifications().map((n) => ({ ...n, isRead: true }));
      saveMockNotifications(notifications);
      return { success: true };
    }
  },

  delete: async (id) => {
    try {
      const response = await api.delete(`/notifications/${id}`);
      return response.data;
    } catch {
      const notifications = getMockNotifications().filter((n) => (n._id || n.id).toString() !== id.toString());
      saveMockNotifications(notifications);
      return { success: true };
    }
  },
};
