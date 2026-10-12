import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { ApiError, asyncHandler } from '../utils/ApiError.js';

const JWT_SECRET = process.env.JWT_SECRET || 'campusfind_super_secret_jwt_key_2026';

const generateToken = (userId, role) => {
  return jwt.sign({ id: userId, role }, JWT_SECRET, { expiresIn: '7d' });
};

// @desc    Register a new student account (Public registration creates STUDENT accounts only)
// @route   POST /api/auth/register
export const register = asyncHandler(async (req, res) => {
  const { name, email, password, phone, collegeId, department } = req.body;

  if (!name || !email || !password) {
    throw new ApiError(400, 'Please provide name, email, and password.');
  }

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    throw new ApiError(409, 'An account with this college email already exists.');
  }

  // Security guarantee: public registration is strictly student role
  const user = await User.create({
    name,
    email: email.toLowerCase(),
    passwordHash: password,
    phone: phone || '',
    collegeId: collegeId || '',
    department: department || 'General Studies',
    role: 'student',
    accountStatus: 'active',
  });

  const token = generateToken(user._id, user.role);

  res.status(201).json({
    success: true,
    message: 'Student account created successfully.',
    token,
    user: user.toJSON(),
  });
});

// @desc    Login user & return JWT token
// @route   POST /api/auth/login
export const login = asyncHandler(async (req, res) => {
  const { email, password, role } = req.body;

  if (!email || !password) {
    throw new ApiError(400, 'Please provide email and password.');
  }

  // Find user and explicitly select passwordHash
  const user = await User.findOne({ email: email.toLowerCase() }).select('+passwordHash');
  if (!user) {
    throw new ApiError(401, 'Invalid email or password.');
  }

  if (user.accountStatus !== 'active') {
    throw new ApiError(403, 'Your account is deactivated. Please contact campus administration.');
  }

  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    throw new ApiError(401, 'Invalid email or password.');
  }

  // Verify role if selected in UI (handling faculty/staff mapping)
  if (role) {
    const userRole = user.role === 'faculty' ? 'staff' : user.role;
    const requestedRole = role === 'faculty' ? 'staff' : role;
    if (userRole !== requestedRole) {
      throw new ApiError(403, `Role mismatch: This account is registered as '${user.role.toUpperCase()}', but '${role.toUpperCase()}' was selected.`);
    }
  }

  const token = generateToken(user._id, user.role);

  res.json({
    success: true,
    message: 'Login successful.',
    token,
    user: user.toJSON(),
  });
});

// @desc    Get currently authenticated user
// @route   GET /api/auth/me
export const getMe = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    user: req.user.toJSON(),
  });
});

// @desc    Update current user profile
// @route   PATCH /api/auth/profile
export const updateProfile = asyncHandler(async (req, res) => {
  const { name, phone, department, avatar, collegeId } = req.body;
  const user = await User.findById(req.user._id);

  if (!user) {
    throw new ApiError(404, 'User not found.');
  }

  if (name) user.name = name;
  if (phone !== undefined) user.phone = phone;
  if (department) user.department = department;
  if (avatar) user.avatar = avatar;
  if (collegeId) user.collegeId = collegeId;

  await user.save();

  res.json({
    success: true,
    message: 'Profile updated successfully.',
    user: user.toJSON(),
  });
});

// @desc    Change password
// @route   POST /api/auth/change-password
export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    throw new ApiError(400, 'Please provide both current and new password.');
  }

  if (newPassword.length < 6) {
    throw new ApiError(400, 'New password must be at least 6 characters.');
  }

  const user = await User.findById(req.user._id).select('+passwordHash');
  const isMatch = await user.matchPassword(currentPassword);
  if (!isMatch) {
    throw new ApiError(400, 'Current password is incorrect.');
  }

  user.passwordHash = newPassword;
  await user.save();

  res.json({
    success: true,
    message: 'Password changed successfully.',
  });
});

// @desc    Logout
// @route   POST /api/auth/logout
export const logout = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    message: 'Logged out successfully.',
  });
});
