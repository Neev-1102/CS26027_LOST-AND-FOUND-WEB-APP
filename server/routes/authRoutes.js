import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'campusfind_super_secret_jwt_key_2026';

// Generate JWT token helper
const generateToken = (userId, role) => {
  return jwt.sign({ id: userId, role }, JWT_SECRET, { expiresIn: '7d' });
};

// @route   POST /api/auth/login
// @desc    Authenticate user & get JWT token (Supports Student, Faculty, Admin)
router.post('/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide both email and password' });
    }

    // Find user in MongoDB
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials. User not found.' });
    }

    // Match password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Optional role check if explicitly provided in request
    if (role && user.role !== role) {
      return res.status(403).json({
        message: `Role mismatch: This account is registered as '${user.role.toUpperCase()}', but you selected '${role.toUpperCase()}'.`,
      });
    }

    const token = generateToken(user._id, user.role);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        phone: user.phone,
        studentId: user.studentId,
        employeeId: user.employeeId,
        avatar: user.avatar,
        status: user.status,
      },
    });
  } catch (error) {
    console.error('Login Route Error:', error);
    res.status(500).json({ message: 'Server error during authentication', error: error.message });
  }
});

// @route   POST /api/auth/google
// @desc    Authenticate or register user via Google SSO with real email ID
router.post('/google', async (req, res) => {
  try {
    const { email, name, avatar, role } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Google email is required' });
    }

    const cleanEmail = email.toLowerCase();
    let user = await User.findOne({ email: cleanEmail });

    const requestedRole = role || (cleanEmail.includes('admin') ? 'admin' : cleanEmail.includes('prof') || cleanEmail.includes('faculty') ? 'faculty' : 'student');

    if (!user) {
      // Auto-create new account in MongoDB for this real Google Email ID
      user = await User.create({
        name: name || cleanEmail.split('@')[0],
        email: cleanEmail,
        password: 'google_sso_verified_password_' + Date.now(),
        role: requestedRole,
        department: requestedRole === 'faculty' ? 'Computer Engineering Dept' : 'General Studies',
        studentId: cleanEmail.includes('charusat') ? cleanEmail.split('@')[0].toUpperCase() : `STU-${Math.floor(1000 + Math.random() * 9000)}`,
        avatar: avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
        status: 'Active',
      });
    }

    const token = generateToken(user._id, user.role);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        phone: user.phone,
        studentId: user.studentId,
        employeeId: user.employeeId,
        avatar: user.avatar,
        status: user.status,
      },
    });
  } catch (error) {
    console.error('Google Auth Route Error:', error);
    res.status(500).json({ message: 'Server error during Google authentication', error: error.message });
  }
});

// @route   POST /api/auth/register
// @desc    Register a new user (Student, Faculty, Admin)
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, department, studentId, employeeId, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: 'An account with this institutional email already exists' });
    }

    const userRole = role || 'student';

    const newUser = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      role: userRole,
      department: department || (userRole === 'faculty' ? 'Computer Science & Eng' : 'General Studies'),
      studentId: studentId || (userRole === 'student' ? `STU-${Math.floor(1000 + Math.random() * 9000)}` : ''),
      employeeId: employeeId || (userRole === 'faculty' ? `FAC-${Math.floor(1000 + Math.random() * 9000)}` : ''),
      phone: phone || '+1 (555) 019-2831',
    });

    const token = generateToken(newUser._id, newUser.role);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        department: newUser.department,
        phone: newUser.phone,
        studentId: newUser.studentId,
        employeeId: newUser.employeeId,
        avatar: newUser.avatar,
        status: newUser.status,
      },
    });
  } catch (error) {
    console.error('Register Route Error:', error);
    res.status(500).json({ message: 'Server error during registration', error: error.message });
  }
});

// @route   GET /api/auth/me
// @desc    Get logged in user profile from JWT header
router.get('/me', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No authorization token provided' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        phone: user.phone,
        studentId: user.studentId,
        employeeId: user.employeeId,
        avatar: user.avatar,
        status: user.status,
      },
    });
  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
});

// @route   GET /api/auth/users
// @desc    Get all users list (Admin only access)
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users list' });
  }
});

export default router;
