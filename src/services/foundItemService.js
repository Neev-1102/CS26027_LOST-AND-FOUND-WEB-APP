import api from './api';
import { INITIAL_FOUND_ITEMS } from '../data/mockData';

const getMockFoundItems = () => {
  const saved = localStorage.getItem('campusfind_found_items');
  return saved ? JSON.parse(saved) : INITIAL_FOUND_ITEMS;
};

const saveMockFoundItems = (items) => {
  localStorage.setItem('campusfind_found_items', JSON.stringify(items));
};

export const foundItemService = {
  getAll: async (params = {}) => {
    try {
      const response = await api.get('/found-items', { params });
      return response.data;
    } catch {
      let items = getMockFoundItems();

      if (params.search) {
        const query = params.search.toLowerCase();
        items = items.filter(
          (item) =>
            (item.internalItemName || item.title || '').toLowerCase().includes(query) ||
            (item.internalDescription || item.description || '').toLowerCase().includes(query) ||
            (item.generalLocation || item.location || '').toLowerCase().includes(query)
        );
      }

      if (params.category && params.category !== 'all') {
        items = items.filter(
          (item) => item.category.toLowerCase() === params.category.toLowerCase()
        );
      }

      if (params.status && params.status !== 'all') {
        items = items.filter((item) => item.status.toLowerCase() === params.status.toLowerCase());
      }

      if (params.sortBy === 'oldest') {
        items.sort((a, b) => new Date(a.dateFound || a.date) - new Date(b.dateFound || b.date));
      } else {
        items.sort((a, b) => new Date(b.dateFound || b.date) - new Date(a.dateFound || a.date));
      }

      return {
        items,
        total: items.length,
      };
    }
  },

  getById: async (id) => {
    try {
      const response = await api.get(`/found-items/${id}`);
      return response.data;
    } catch {
      const items = getMockFoundItems();
      const item = items.find((i) => (i._id || i.id).toString() === id.toString());
      if (!item) throw new Error('Found item record not found');
      return { item };
    }
  },

  create: async (itemData) => {
    try {
      const response = await api.post('/found-items', itemData);
      return response.data;
    } catch (err) {
      if (err.response?.data?.message) throw new Error(err.response.data.message);
      const items = getMockFoundItems();
      const user = JSON.parse(localStorage.getItem('campusfind_user') || '{}');

      const newItem = {
        _id: 'fnd_' + Date.now(),
        id: 'fnd_' + Date.now(),
        internalItemName: itemData.internalItemName || itemData.title,
        title: itemData.internalItemName || itemData.title,
        category: itemData.category,
        internalDescription: itemData.internalDescription || itemData.description,
        description: itemData.internalDescription || itemData.description,
        color: itemData.color || 'Unspecified',
        brand: itemData.brand || '',
        dateFound: itemData.dateFound || itemData.date || new Date().toISOString(),
        date: itemData.dateFound || itemData.date || new Date().toISOString(),
        generalLocation: itemData.generalLocation || itemData.location,
        location: itemData.generalLocation || itemData.location,
        storageLocation: itemData.storageLocation || 'Security Desk',
        status: 'in_custody',
        images: itemData.images || ['https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=600'],
        image: itemData.images?.[0] || 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=600',
        registeredBy: user,
        createdAt: new Date().toISOString(),
      };

      items.unshift(newItem);
      saveMockFoundItems(items);
      return { success: true, item: newItem };
    }
  },

  update: async (id, itemData) => {
    try {
      const response = await api.patch(`/found-items/${id}`, itemData);
      return response.data;
    } catch (err) {
      if (err.response?.data?.message) throw new Error(err.response.data.message);
      const items = getMockFoundItems();
      const index = items.findIndex((i) => (i._id || i.id).toString() === id.toString());
      if (index === -1) throw new Error('Item not found');
      items[index] = { ...items[index], ...itemData };
      saveMockFoundItems(items);
      return { success: true, item: items[index] };
    }
  },

  delete: async (id) => {
    try {
      const response = await api.delete(`/found-items/${id}`);
      return response.data;
    } catch (err) {
      if (err.response?.data?.message) throw new Error(err.response.data.message);
      const items = getMockFoundItems().filter((i) => (i._id || i.id).toString() !== id.toString());
      saveMockFoundItems(items);
      return { success: true, message: 'Deleted' };
    }
  },
};
