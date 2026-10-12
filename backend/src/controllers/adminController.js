import User from '../models/User.js';
import LostItem from '../models/LostItem.js';
import FoundItem from '../models/FoundItem.js';
import Claim from '../models/Claim.js';
import Category from '../models/Category.js';
import AuditLog from '../models/AuditLog.js';
import { ApiError, asyncHandler } from '../utils/ApiError.js';

// @desc    Get system-wide dashboard statistics
// @route   GET /api/admin/dashboard
export const getDashboardStats = asyncHandler(async (req, res) => {
  const [
    totalUsers,
    totalLost,
    totalFound,
    totalClaims,
    recentAuditLogs,
    usersByRole,
    claimsByStatus,
    foundByStatus,
  ] = await Promise.all([
    User.countDocuments(),
    LostItem.countDocuments(),
    FoundItem.countDocuments(),
    Claim.countDocuments(),
    AuditLog.find().populate('actor', 'name email role').sort({ createdAt: -1 }).limit(10),
    User.aggregate([{ $group: { _id: '$role', count: { $sum: 1 } } }]),
    Claim.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
    FoundItem.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
  ]);

  const returnedFound = await FoundItem.countDocuments({ status: 'returned' });
  const recoveryRate = totalFound > 0 ? Math.round((returnedFound / totalFound) * 100) : 0;

  res.json({
    success: true,
    stats: {
      totalUsers,
      totalLost,
      totalFound,
      totalClaims,
      returnedCount: returnedFound,
      recoveryRate,
      usersByRole: usersByRole.reduce((acc, curr) => ({ ...acc, [curr._id]: curr.count }), {}),
      claimsByStatus: claimsByStatus.reduce((acc, curr) => ({ ...acc, [curr._id]: curr.count }), {}),
      foundByStatus: foundByStatus.reduce((acc, curr) => ({ ...acc, [curr._id]: curr.count }), {}),
      recentAuditLogs,
    },
  });
});

// @desc    Get all campus users
// @route   GET /api/admin/users
export const getAllUsers = asyncHandler(async (req, res) => {
  const { role, status, search } = req.query;
  const filter = {};

  if (role && role !== 'all') {
    filter.role = role === 'faculty' ? { $in: ['staff', 'faculty'] } : role;
  }

  if (status && status !== 'all') {
    filter.accountStatus = status;
  }

  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { collegeId: { $regex: search, $options: 'i' } },
      { department: { $regex: search, $options: 'i' } },
    ];
  }

  const users = await User.find(filter).sort({ createdAt: -1 });

  res.json({
    success: true,
    total: users.length,
    users,
  });
});

// @desc    Create a new authorized Staff account (Admin operation only)
// @route   POST /api/admin/staff
export const createStaffAccount = asyncHandler(async (req, res) => {
  const { name, email, password, department, employeeId, phone } = req.body;

  if (!name || !email || !password) {
    throw new ApiError(400, 'Please provide name, email, and initial password for staff account.');
  }

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    throw new ApiError(409, 'An account with this email already exists.');
  }

  const staff = await User.create({
    name,
    email: email.toLowerCase(),
    passwordHash: password,
    role: 'staff',
    department: department || 'Campus Security & Lost Property Desk',
    collegeId: employeeId || `STF-${Math.floor(1000 + Math.random() * 9000)}`,
    phone: phone || '',
    accountStatus: 'active',
  });

  await AuditLog.create({
    actor: req.user._id,
    action: 'CREATE_STAFF_ACCOUNT',
    targetType: 'User',
    targetId: staff._id.toString(),
    summary: `Admin '${req.user.name}' created staff account for '${name}' <${email}>`,
  });

  res.status(201).json({
    success: true,
    message: 'Staff account created successfully.',
    user: staff.toJSON(),
  });
});

// @desc    Update user status or role (Admin only)
// @route   PATCH /api/admin/users/:id
export const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    throw new ApiError(404, 'User not found.');
  }

  const { accountStatus, role, department } = req.body;

  if (accountStatus) {
    user.accountStatus = accountStatus;
  }

  if (role) {
    if (!['student', 'staff', 'admin'].includes(role)) {
      throw new ApiError(400, 'Invalid role specification.');
    }
    user.role = role;
  }

  if (department) {
    user.department = department;
  }

  await user.save();

  await AuditLog.create({
    actor: req.user._id,
    action: 'UPDATE_USER_ACCOUNT',
    targetType: 'User',
    targetId: user._id.toString(),
    summary: `Admin '${req.user.name}' updated user '${user.email}' (status: ${user.accountStatus}, role: ${user.role})`,
  });

  res.json({
    success: true,
    message: 'User account updated successfully.',
    user: user.toJSON(),
  });
});

// @desc    Delete user account (Admin only)
// @route   DELETE /api/admin/users/:id
export const deleteUser = asyncHandler(async (req, res) => {
  if (req.params.id === req.user._id.toString()) {
    throw new ApiError(400, 'Admins cannot delete their own active account.');
  }

  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) {
    throw new ApiError(404, 'User not found.');
  }

  await AuditLog.create({
    actor: req.user._id,
    action: 'DELETE_USER',
    targetType: 'User',
    targetId: req.params.id,
    summary: `Admin '${req.user.name}' deleted user account '${user.email}'`,
  });

  res.json({
    success: true,
    message: 'User account deleted successfully.',
  });
});

// @desc    Get system audit logs
// @route   GET /api/admin/audit-logs
export const getAuditLogs = asyncHandler(async (req, res) => {
  const { limit = 50 } = req.query;
  const logs = await AuditLog.find()
    .populate('actor', 'name email role')
    .sort({ createdAt: -1 })
    .limit(Number(limit));

  res.json({
    success: true,
    total: logs.length,
    logs,
  });
});

// @desc    Get analytics and recovery metrics
// @route   GET /api/admin/analytics
export const getAnalytics = asyncHandler(async (req, res) => {
  const [categoryCounts, monthlyTrends] = await Promise.all([
    FoundItem.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]),
    FoundItem.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
          foundCount: { $sum: 1 },
          returnedCount: {
            $sum: { $cond: [{ $eq: ['$status', 'returned'] }, 1, 0] },
          },
        },
      },
      { $sort: { _id: 1 } },
    ]),
  ]);

  res.json({
    success: true,
    categoryCounts,
    monthlyTrends,
  });
});

// Categories CRUD
export const getAllCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find().sort({ name: 1 });
  res.json({
    success: true,
    categories,
  });
});

export const createCategory = asyncHandler(async (req, res) => {
  const { name, description, icon } = req.body;
  if (!name) throw new ApiError(400, 'Category name is required.');

  const category = await Category.create({ name, description, icon: icon || 'Box' });
  res.status(201).json({ success: true, category });
});

export const updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!category) throw new ApiError(404, 'Category not found.');
  res.json({ success: true, category });
});

export const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findByIdAndDelete(req.params.id);
  if (!category) throw new ApiError(404, 'Category not found.');
  res.json({ success: true, message: 'Category removed.' });
});
