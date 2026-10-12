import mongoose from 'mongoose';

const claimSchema = new mongoose.Schema(
  {
    foundItem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'FoundItem',
      required: true,
      index: true,
    },
    lostItem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'LostItem',
      default: null,
    },
    claimant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    explanation: {
      type: String,
      required: [true, 'Please explain why this item belongs to you'],
      trim: true,
    },
    identifyingEvidence: {
      type: String,
      required: [true, 'Please describe unique identifying features (scratches, marks, serial #, contents)'],
      trim: true,
    },
    proofFiles: {
      type: [String],
      default: [],
      // Private proof documents (receipts, serial number photos, purchase bill)
    },
    status: {
      type: String,
      enum: [
        'pending',
        'under_review',
        'additional_information_requested',
        'approved',
        'rejected',
        'completed',
      ],
      default: 'pending',
      index: true,
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    reviewRemark: {
      type: String,
      default: '',
    },
    reviewedAt: {
      type: Date,
      default: null,
    },
    handoverConfirmedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Claim = mongoose.model('Claim', claimSchema);
export default Claim;
