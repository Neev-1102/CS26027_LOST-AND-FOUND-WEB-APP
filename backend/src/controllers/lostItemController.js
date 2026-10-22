import LostItem from '../models/LostItem.js';
import AuditLog from '../models/AuditLog.js';
import { ApiError, asyncHandler } from '../utils/ApiError.js';
import { sendNotification } from '../services/notificationService.js';
import { findPossibleMatches } from '../services/matchingService.js';
import { getDefaultItemImage } from '../utils/itemImageHelper.js';

// @desc    Report a lost item
// @route   POST /api/lost-items
export const createLostItem = asyncHandler(async (req, res) => {
  const { itemName, category, description, color, brand, dateLost, approximateTime, locationLost, images } = req.body;

  if (!itemName || !category || !description || !color || !dateLost || !locationLost) {
    throw new ApiError(400, 'Please complete all required fields (item name, category, description, color, date, location).');
  }

  const defaultPhoto = getDefaultItemImage(itemName, category);
  const resolvedImages = (images && images.length > 0) ? images : [defaultPhoto];

  const lostItem = await LostItem.create({
    reportedBy: req.user._id,
    itemName,
    category,
    description,
    color,
    brand: brand || '',
    dateLost,
    approximateTime: approximateTime || '',
    locationLost,
    images: resolvedImages,
    status: 'pending_review',
  });

  // Notify student
  await sendNotification({
    recipient: req.user._id,
    title: 'Lost Item Report Submitted',
    message: `Your report for "${itemName}" has been submitted for staff review.`,
    type: 'system',
    relatedItem: lostItem._id,
  });

  // Check for any immediate possible matches
  const matches = await findPossibleMatches(lostItem);
  if (matches.length > 0) {
    await sendNotification({
      recipient: req.user._id,
      title: 'Potential Match Found!',
      message: `We found ${matches.length} possible item(s) in campus custody that might match "${itemName}".`,
      type: 'match',
      relatedItem: lostItem._id,
    });
  }

  res.status(201).json({
    success: true,
    message: 'Lost item report submitted successfully.',
    item: lostItem,
    possibleMatchesCount: matches.length,
  });
});

// @desc    Get reports created by current user
// @route   GET /api/lost-items/my
export const getMyLostItems = asyncHandler(async (req, res) => {
  const items = await LostItem.find({ reportedBy: req.user._id }).sort({ createdAt: -1 });
  res.json({
    success: true,
    total: items.length,
    items,
  });
});

// @desc    Get all lost items (filtered by visibility)
// @route   GET /api/lost-items
export const getAllLostItems = asyncHandler(async (req, res) => {
  const { search, category, status, sortBy = 'newest' } = req.query;
  const userRole = req.user ? (req.user.role === 'faculty' ? 'staff' : req.user.role) : 'guest';

  const filter = {};

  // Students/Guests can only see approved lost items unless searching their own
  if (userRole !== 'staff' && userRole !== 'admin') {
    filter.status = 'approved';
  } else if (status && status !== 'all') {
    filter.status = status;
  }

  if (category && category !== 'all') {
    filter.category = new RegExp(`^${category}$`, 'i');
  }

  if (search) {
    filter.$or = [
      { itemName: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { locationLost: { $regex: search, $options: 'i' } },
      { brand: { $regex: search, $options: 'i' } },
    ];
  }

  const sortOrder = sortBy === 'oldest' ? { dateLost: 1 } : { createdAt: -1 };
  const items = await LostItem.find(filter).populate('reportedBy', 'name email department avatar').sort(sortOrder);

  res.json({
    success: true,
    total: items.length,
    items,
  });
});

// @desc    Get single lost item by ID
// @route   GET /api/lost-items/:id
export const getLostItemById = asyncHandler(async (req, res) => {
  const item = await LostItem.findById(req.params.id).populate('reportedBy', 'name email department avatar');
  if (!item) {
    throw new ApiError(404, 'Lost item report not found.');
  }

  const userRole = req.user ? (req.user.role === 'faculty' ? 'staff' : req.user.role) : 'guest';
  const isOwner = req.user && item.reportedBy && item.reportedBy._id.toString() === req.user._id.toString();

  // If item is pending/rejected, only owner, staff, or admin may view
  if (item.status !== 'approved' && item.status !== 'resolved' && !isOwner && userRole !== 'staff' && userRole !== 'admin') {
    throw new ApiError(403, 'You do not have permission to view this report.');
  }

  res.json({
    success: true,
    item,
  });
});

// @desc    Update lost item (Student updates own details; Staff/Admin reviews and updates status)
// @route   PATCH /api/lost-items/:id
export const updateLostItem = asyncHandler(async (req, res) => {
  const item = await LostItem.findById(req.params.id);
  if (!item) {
    throw new ApiError(404, 'Lost item report not found.');
  }

  const userRole = req.user.role === 'faculty' ? 'staff' : req.user.role;
  const isOwner = item.reportedBy.toString() === req.user._id.toString();

  if (!isOwner && userRole !== 'staff' && userRole !== 'admin') {
    throw new ApiError(403, 'Unauthorized to edit this report.');
  }

  // Staff/Admin review action
  if (req.body.status && (userRole === 'staff' || userRole === 'admin')) {
    item.status = req.body.status;
    item.reviewedBy = req.user._id;
    if (req.body.reviewRemark !== undefined) {
      item.reviewRemark = req.body.reviewRemark;
    }

    await AuditLog.create({
      actor: req.user._id,
      action: 'REVIEW_LOST_ITEM',
      targetType: 'LostItem',
      targetId: item._id.toString(),
      summary: `Staff/Admin updated lost item '${item.itemName}' status to '${item.status}'`,
    });

    await sendNotification({
      recipient: item.reportedBy,
      title: `Lost Item Status: ${item.status.toUpperCase()}`,
      message: `Your lost item report for "${item.itemName}" was marked as ${item.status}. ${item.reviewRemark || ''}`,
      type: 'approval',
      relatedItem: item._id,
    });
  }

  // Student updating fields
  if (isOwner) {
    const { itemName, category, description, color, brand, locationLost, dateLost, approximateTime, images } = req.body;
    if (itemName) item.itemName = itemName;
    if (category) item.category = category;
    if (description) item.description = description;
    if (color) item.color = color;
    if (brand !== undefined) item.brand = brand;
    if (locationLost) item.locationLost = locationLost;
    if (dateLost) item.dateLost = dateLost;
    if (approximateTime !== undefined) item.approximateTime = approximateTime;
    if (images) item.images = images;
  }

  await item.save();

  res.json({
    success: true,
    message: 'Report updated successfully.',
    item,
  });
});

// @desc    Delete lost item
// @route   DELETE /api/lost-items/:id
export const deleteLostItem = asyncHandler(async (req, res) => {
  const item = await LostItem.findById(req.params.id);
  if (!item) {
    throw new ApiError(404, 'Lost item report not found.');
  }

  const userRole = req.user.role === 'faculty' ? 'staff' : req.user.role;
  const isOwner = item.reportedBy.toString() === req.user._id.toString();

  if (!isOwner && userRole !== 'admin') {
    throw new ApiError(403, 'Unauthorized to delete this report.');
  }

  await LostItem.findByIdAndDelete(req.params.id);

  res.json({
    success: true,
    message: 'Lost item report deleted successfully.',
  });
});

// @desc    Get possible matches for a lost item
// @route   GET /api/lost-items/:id/matches
export const getPossibleMatches = asyncHandler(async (req, res) => {
  const item = await LostItem.findById(req.params.id);
  if (!item) {
    throw new ApiError(404, 'Lost item not found.');
  }

  const matches = await findPossibleMatches(item);
  res.json({
    success: true,
    total: matches.length,
    matches,
  });
});
