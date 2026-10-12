import mongoose from 'mongoose';

const foundItemSchema = new mongoose.Schema(
  {
    registeredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    internalItemName: {
      type: String,
      required: [true, 'Please provide found item name/label'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Please select category'],
      trim: true,
      index: true,
    },
    internalDescription: {
      type: String,
      required: [true, 'Please provide item description'],
      trim: true,
    },
    color: {
      type: String,
      required: [true, 'Please specify color'],
      trim: true,
    },
    brand: {
      type: String,
      trim: true,
      default: '',
    },
    dateFound: {
      type: Date,
      required: [true, 'Please select date found'],
    },
    approximateTime: {
      type: String,
      trim: true,
      default: '',
    },
    generalLocation: {
      type: String,
      required: [true, 'Please specify general found location'],
      trim: true,
    },
    storageLocation: {
      type: String,
      required: [true, 'Please specify internal secure storage location/locker'],
      trim: true,
      // Note: Must NEVER be disclosed to students/public!
    },
    images: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ['in_custody', 'claim_pending', 'approved_for_handover', 'returned', 'archived'],
      default: 'in_custody',
      index: true,
    },
    handedOverTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    handoverConfirmedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    handoverConfirmedAt: {
      type: Date,
      default: null,
    },
    handoverNotes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

foundItemSchema.index({ internalItemName: 'text', internalDescription: 'text', generalLocation: 'text' });

const FoundItem = mongoose.model('FoundItem', foundItemSchema);
export default FoundItem;
