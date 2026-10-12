import Notification from '../models/Notification.js';
import { ApiError, asyncHandler } from '../utils/ApiError.js';

// @desc    Get current user notifications
// @route   GET /api/notifications
export const getUserNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ recipient: req.user._id }).sort({ createdAt: -1 });
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  res.json({
    success: true,
    total: notifications.length,
    unreadCount,
    notifications,
  });
});

// @desc    Mark a notification as read
// @route   PATCH /api/notifications/:id/read
export const markAsRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findOne({
    _id: req.params.id,
    recipient: req.user._id,
  });

  if (!notification) {
    throw new ApiError(404, 'Notification not found.');
  }

  notification.isRead = true;
  await notification.save();

  res.json({
    success: true,
    message: 'Notification marked as read.',
    notification,
  });
});

// @desc    Mark all user notifications as read
// @route   PATCH /api/notifications/read-all
export const markAllAsRead = asyncHandler(async (req, res) => {
  await Notification.updateMany({ recipient: req.user._id, isRead: false }, { isRead: true });

  res.json({
    success: true,
    message: 'All notifications marked as read.',
  });
});

// @desc    Delete notification
// @route   DELETE /api/notifications/:id
export const deleteNotification = asyncHandler(async (req, res) => {
  const result = await Notification.findOneAndDelete({
    _id: req.params.id,
    recipient: req.user._id,
  });

  if (!result) {
    throw new ApiError(404, 'Notification not found.');
  }

  res.json({
    success: true,
    message: 'Notification deleted.',
  });
});
