import api from './api';
import { INITIAL_LOST_ITEMS } from '../data/mockData';
import { getItemImage, getDefaultItemImage } from '../utils/itemImageHelper';

const getMockLostItems = () => {
  const saved = localStorage.getItem('campusfind_lost_items');
  let items = saved ? JSON.parse(saved) : INITIAL_LOST_ITEMS;
  let changed = false;

  // Auto-heal items with proper photos matching item names
  items = items.map((item) => {
    const fixedImg = getItemImage(item);
    const currImg = (item.images && item.images.length > 0) ? item.images[0] : (item.image || '');
    if (currImg !== fixedImg) {
      changed = true;
      return {
        ...item,
        image: fixedImg,
        images: [fixedImg],
      };
    }
    return item;
  });

  if (changed && saved) {
    try {
      localStorage.setItem('campusfind_lost_items', JSON.stringify(items));
    } catch {
      // storage error
    }
  }

  return items;
};

const saveMockLostItems = (items) => {
  localStorage.setItem('campusfind_lost_items', JSON.stringify(items));
};

export const lostItemService = {
  getAll: async (params = {}) => {
    try {
      const response = await api.get('/lost-items', { params });
      return response.data;
    } catch {
      let items = getMockLostItems();

      if (params.search) {
        const query = params.search.toLowerCase();
        items = items.filter(
          (item) =>
            (item.itemName || item.title || '').toLowerCase().includes(query) ||
            (item.description || '').toLowerCase().includes(query) ||
            (item.locationLost || item.location || '').toLowerCase().includes(query) ||
            (item.brand || '').toLowerCase().includes(query)
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
        items.sort((a, b) => new Date(a.dateLost || a.date) - new Date(b.dateLost || b.date));
      } else {
        items.sort((a, b) => new Date(b.dateLost || b.date) - new Date(a.dateLost || a.date));
      }

      return {
        items,
        total: items.length,
      };
    }
  },

  getMyLostItems: async () => {
    try {
      const response = await api.get('/lost-items/my');
      return response.data;
    } catch {
      const user = JSON.parse(localStorage.getItem('campusfind_user') || '{}');
      const items = getMockLostItems().filter(
        (i) => i.reportedBy?._id === user.id || i.reporterEmail === user.email || i.reportedBy === user.id
      );
      return { items, total: items.length };
    }
  },

  getById: async (id) => {
    try {
      const response = await api.get(`/lost-items/${id}`);
      return response.data;
    } catch {
      const items = getMockLostItems();
      const item = items.find((i) => (i._id || i.id).toString() === id.toString());
      if (!item) throw new Error('Lost item not found');
      return { item };
    }
  },

  create: async (itemData) => {
    try {
      const response = await api.post('/lost-items', itemData);
      return response.data;
    } catch (err) {
      if (err.response?.data?.message) throw new Error(err.response.data.message);
      const items = getMockLostItems();
      const user = JSON.parse(localStorage.getItem('campusfind_user') || '{}');

      const title = itemData.itemName || itemData.title || itemData.name;
      const defaultImg = getDefaultItemImage(title, itemData.category);
      const chosenImages = (itemData.images && itemData.images.length > 0)
        ? itemData.images
        : (itemData.image ? [itemData.image] : [defaultImg]);

      const newItem = {
        _id: 'lst_' + Date.now(),
        id: 'lst_' + Date.now(),
        itemName: title,
        title: title,
        category: itemData.category,
        description: itemData.description,
        color: itemData.color || 'Unspecified',
        brand: itemData.brand || '',
        dateLost: itemData.dateLost || itemData.date || new Date().toISOString(),
        date: itemData.dateLost || itemData.date || new Date().toISOString(),
        locationLost: itemData.locationLost || itemData.location,
        location: itemData.locationLost || itemData.location,
        status: 'pending_review',
        images: chosenImages,
        image: chosenImages[0] || defaultImg,
        reportedBy: user,
        createdAt: new Date().toISOString(),
      };

      items.unshift(newItem);
      saveMockLostItems(items);
      return { success: true, item: newItem };
    }
  },

  update: async (id, itemData) => {
    try {
      const response = await api.patch(`/lost-items/${id}`, itemData);
      return response.data;
    } catch (err) {
      if (err.response?.data?.message) throw new Error(err.response.data.message);
      const items = getMockLostItems();
      const index = items.findIndex((i) => (i._id || i.id).toString() === id.toString());
      if (index === -1) throw new Error('Item not found');
      items[index] = { ...items[index], ...itemData };
      saveMockLostItems(items);
      return { success: true, item: items[index] };
    }
  },

  delete: async (id) => {
    try {
      const response = await api.delete(`/lost-items/${id}`);
      return response.data;
    } catch (err) {
      if (err.response?.data?.message) throw new Error(err.response.data.message);
      const items = getMockLostItems().filter((i) => (i._id || i.id).toString() !== id.toString());
      saveMockLostItems(items);
      return { success: true, message: 'Deleted' };
    }
  },

  getPossibleMatches: async (id) => {
    try {
      const response = await api.get(`/lost-items/${id}/matches`);
      return response.data;
    } catch {
      return { total: 0, matches: [] };
    }
  },
};
