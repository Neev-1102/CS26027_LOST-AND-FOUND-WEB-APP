import Notification from '../models/Notification.js';

export const sendNotification = async ({ recipient, title, message, type = 'system', relatedItem = null, relatedClaim = null }) => {
  try {
    const notification = await Notification.create({
      recipient,
      title,
      message,
      type,
      relatedItem,
      relatedClaim,
    });
    return notification;
  } catch (err) {
    console.error('Failed to dispatch notification:', err.message);
    return null;
  }
};
