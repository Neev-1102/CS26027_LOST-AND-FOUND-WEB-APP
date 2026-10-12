import express from 'express';
import Report from '../models/Report.js';

const router = express.Router();

// @route   GET /api/reports
// @desc    Get all lost/found reports with filtering
router.get('/', async (req, res) => {
  try {
    const { type, category, status, department, search } = req.query;
    const filter = {};

    if (type) filter.type = type;
    if (category) filter.category = category;
    if (status) filter.status = status;
    if (department) filter.department = department;

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
      ];
    }

    const reports = await Report.find(filter).sort({ createdAt: -1 });
    res.json(reports);
  } catch (error) {
    console.error('Fetch reports error:', error);
    res.status(500).json({ message: 'Failed to fetch reports from database' });
  }
});

// @route   GET /api/reports/:id
// @desc    Get single report details
router.get('/:id', async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }
    res.json(report);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving report' });
  }
});

// @route   POST /api/reports
// @desc    Create a new lost or found report
router.post('/', async (req, res) => {
  try {
    const {
      type,
      title,
      category,
      description,
      location,
      date,
      reporterName,
      reporterRole,
      reporterEmail,
      reporterPhone,
      department,
      images,
    } = req.body;

    if (!type || !title || !description || !location) {
      return res.status(400).json({ message: 'Please provide type, title, description, and location' });
    }

    const newReport = await Report.create({
      type,
      title,
      category: category || 'Electronics',
      description,
      location,
      date: date || new Date().toISOString().split('T')[0],
      status: 'pending',
      reporterName: reporterName || 'Campus User',
      reporterRole: reporterRole || 'student',
      reporterEmail: reporterEmail || '',
      reporterPhone: reporterPhone || '',
      department: department || 'General Studies',
      images: images || ['https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=600'],
    });

    res.status(201).json({
      success: true,
      report: newReport,
    });
  } catch (error) {
    console.error('Create report error:', error);
    res.status(500).json({ message: 'Failed to create report', error: error.message });
  }
});

// @route   PUT /api/reports/:id
// @desc    Update report status or details (Resolve/Claim/Approve)
router.put('/:id', async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    const updatedReport = await Report.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      report: updatedReport,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating report', error: error.message });
  }
});

// @route   DELETE /api/reports/:id
// @desc    Delete a report (Admin or owner)
router.delete('/:id', async (req, res) => {
  try {
    const report = await Report.findByIdAndDelete(req.params.id);
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }
    res.json({ success: true, message: 'Report deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting report' });
  }
});

export default router;
