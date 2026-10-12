import mongoose from 'mongoose';

const lostItemSchema = new mongoose.Schema(
  {
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    itemName: {
      type: String,
      required: [true, 'Please enter lost item name'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Please select category'],
      trim: true,
      index: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide detailed description'],
      trim: true,
    },
    color: {
      type: String,
      required: [true, 'Please specify item color'],
      trim: true,
    },
    brand: {
      type: String,
      trim: true,
      default: '',
    },
    dateLost: {
      type: Date,
      required: [true, 'Please select date lost'],
    },
    approximateTime: {
      type: String,
      trim: true,
      default: '',
    },
    locationLost: {
      type: String,
      required: [true, 'Please state where the item was lost'],
      trim: true,
    },
    images: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ['pending_review', 'approved', 'rejected', 'resolved'],
      default: 'pending_review',
      index: true,
    },
    reviewRemark: {
      type: String,
      default: '',
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for fast searching
lostItemSchema.index({ itemName: 'text', description: 'text', locationLost: 'text' });

const LostItem = mongoose.model('LostItem', lostItemSchema);
export default LostItem;
