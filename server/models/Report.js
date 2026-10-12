import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['lost', 'found'],
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      default: 'Electronics',
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
    },
    date: {
      type: String,
      required: [true, 'Date is required'],
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'resolved', 'claimed'],
      default: 'pending',
    },
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    reporterName: {
      type: String,
      default: 'Anonymous',
    },
    reporterRole: {
      type: String,
      enum: ['student', 'faculty', 'admin'],
      default: 'student',
    },
    reporterEmail: {
      type: String,
      default: '',
    },
    reporterPhone: {
      type: String,
      default: '',
    },
    department: {
      type: String,
      default: '',
    },
    images: [
      {
        type: String,
      },
    ],
    claimedBy: {
      name: String,
      email: String,
      claimDate: String,
      verificationNotes: String,
    },
  },
  {
    timestamps: true,
  }
);

const Report = mongoose.models.Report || mongoose.model('Report', reportSchema);
export default Report;
