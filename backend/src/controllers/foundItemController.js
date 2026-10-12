import FoundItem from '../models/FoundItem.js';
import LostItem from '../models/LostItem.js';
import AuditLog from '../models/AuditLog.js';
import { ApiError, asyncHandler } from '../utils/ApiError.js';
import { sendNotification } from '../services/notificationService.js';
import { findPossibleMatches } from '../services/matchingService.js';

// @desc    Register a found item (Staff/Admin only)
// @route   POST /api/found-items
export const createFoundItem = asyncHandler(async (req, res) => {
  const {
    internalItemName,
    name,
    title,
    category,
    internalDescription,
    description,
    color,
    brand,
    dateFound,
    date,
    approximateTime,
    time,
    generalLocation,
    location,
    storageLocation,
    images,
    image,
  } = req.body;

  const itemName = internalItemName || title || name;
  const itemDesc = internalDescription || description;
  const itemLoc = generalLocation || location;
  const itemDate = dateFound || date || new Date();
  const itemTime = approximateTime || time || '';
  const itemStorage = storageLocation || 'Security Desk (Turned in by student)';
  const itemImages = images || (image ? [image] : []);

  if (!itemName || !category || !itemDesc || !itemLoc) {
    throw new ApiError(400, 'Please provide item name, category, description, and location.');
  }

  const foundItem = await FoundItem.create({
    registeredBy: req.user._id,
    internalItemName: itemName,
    category,
    internalDescription: itemDesc,
    color: color || 'Unspecified',
    brand: brand || '',
    dateFound: itemDate,
    approximateTime: itemTime,
    generalLocation: itemLoc,
    storageLocation: itemStorage,
    images: itemImages,
    status: 'in_custody',
  });

  // Record audit log
  await AuditLog.create({
    actor: req.user._id,
    action: 'CREATE_FOUND_ITEM',
    targetType: 'FoundItem',
    targetId: foundItem._id.toString(),
    summary: `Staff '${req.user.name}' registered found item '${internalItemName}' into custody at '${storageLocation}'`,
  });

  // Check against pending lost reports to alert relevant students
  const activeLostItems = await LostItem.find({ status: { $in: ['pending_review', 'approved'] } });
  for (const lost of activeLostItems) {
    const matches = await findPossibleMatches(lost);
    const hasMatch = matches.some((m) => m.foundItem._id.toString() === foundItem._id.toString());
    if (hasMatch) {
      await sendNotification({
        recipient: lost.reportedBy,
        title: 'New Found Item May Match Your Report',
        message: `A found item in category '${foundItem.category}' was handed over to campus custody that may match your "${lost.itemName}".`,
        type: 'match',
        relatedItem: foundItem._id,
      });
    }
  }

  res.status(201).json({
    success: true,
    message: 'Found item recorded in custody successfully.',
    item: foundItem,
  });
});

// @desc    Get found items (Staff gets full inventory; Students get redacted claimable listings)
// @route   GET /api/found-items
export const getAllFoundItems = asyncHandler(async (req, res) => {
  const { search, category, status, sortBy = 'newest' } = req.query;
  const userRole = req.user ? (req.user.role === 'faculty' ? 'staff' : req.user.role) : 'guest';
  const isStaffOrAdmin = userRole === 'staff' || userRole === 'admin';

  const filter = {};

  if (!isStaffOrAdmin) {
    // Students can only see claimable listings (in_custody or claim_pending)
    filter.status = { $in: ['in_custody', 'claim_pending'] };
  } else if (status && status !== 'all') {
    filter.status = status;
  }

  if (category && category !== 'all') {
    filter.category = new RegExp(`^${category}$`, 'i');
  }

  if (search) {
    filter.$or = [
      { internalItemName: { $regex: search, $options: 'i' } },
      { internalDescription: { $regex: search, $options: 'i' } },
      { generalLocation: { $regex: search, $options: 'i' } },
      { color: { $regex: search, $options: 'i' } },
    ];
  }

  const sortOrder = sortBy === 'oldest' ? { dateFound: 1 } : { createdAt: -1 };

  let query = FoundItem.find(filter).sort(sortOrder);

  if (isStaffOrAdmin) {
    query = query.populate('registeredBy', 'name email department');
  } else {
    // IMPORTANT: Exclude storageLocation and internal details for non-staff
    query = query.select('-storageLocation -handoverNotes');
  }

  const items = await query.exec();

  res.json({
    success: true,
    total: items.length,
    items,
  });
});

// @desc    Get single found item by ID
// @route   GET /api/found-items/:id
export const getFoundItemById = asyncHandler(async (req, res) => {
  const userRole = req.user ? (req.user.role === 'faculty' ? 'staff' : req.user.role) : 'guest';
  const isStaffOrAdmin = userRole === 'staff' || userRole === 'admin';

  let query = FoundItem.findById(req.params.id);

  if (isStaffOrAdmin) {
    query = query.populate('registeredBy', 'name email department').populate('handedOverTo', 'name email collegeId');
  } else {
    // Strip private storage and handover notes
    query = query.select('-storageLocation -handoverNotes');
  }

  const item = await query.exec();
  if (!item) {
    throw new ApiError(404, 'Found item record not found.');
  }

  res.json({
    success: true,
    item,
  });
});

// @desc    Update found item (Staff/Admin only)
// @route   PATCH /api/found-items/:id
export const updateFoundItem = asyncHandler(async (req, res) => {
  const item = await FoundItem.findById(req.params.id);
  if (!item) {
    throw new ApiError(404, 'Found item record not found.');
  }

  const {
    internalItemName,
    category,
    internalDescription,
    color,
    brand,
    dateFound,
    approximateTime,
    generalLocation,
    storageLocation,
    status,
    images,
  } = req.body;

  if (internalItemName) item.internalItemName = internalItemName;
  if (category) item.category = category;
  if (internalDescription) item.internalDescription = internalDescription;
  if (color) item.color = color;
  if (brand !== undefined) item.brand = brand;
  if (dateFound) item.dateFound = dateFound;
  if (approximateTime !== undefined) item.approximateTime = approximateTime;
  if (generalLocation) item.generalLocation = generalLocation;
  if (storageLocation) item.storageLocation = storageLocation;
  if (status) item.status = status;
  if (images) item.images = images;

  await item.save();

  await AuditLog.create({
    actor: req.user._id,
    action: 'UPDATE_FOUND_ITEM',
    targetType: 'FoundItem',
    targetId: item._id.toString(),
    summary: `Staff/Admin updated found item '${item.internalItemName}'`,
  });

  res.json({
    success: true,
    message: 'Found item details updated successfully.',
    item,
  });
});

// @desc    Delete found item (Admin only)
// @route   DELETE /api/found-items/:id
export const deleteFoundItem = asyncHandler(async (req, res) => {
  const item = await FoundItem.findById(req.params.id);
  if (!item) {
    throw new ApiError(404, 'Found item record not found.');
  }

  await FoundItem.findByIdAndDelete(req.params.id);

  await AuditLog.create({
    actor: req.user._id,
    action: 'DELETE_FOUND_ITEM',
    targetType: 'FoundItem',
    targetId: req.params.id,
    summary: `Admin '${req.user.name}' deleted found item '${item.internalItemName}'`,
  });

  res.json({
    success: true,
    message: 'Found item deleted successfully.',
  });
});
