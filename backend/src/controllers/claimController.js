import Claim from '../models/Claim.js';
import FoundItem from '../models/FoundItem.js';
import AuditLog from '../models/AuditLog.js';
import { ApiError, asyncHandler } from '../utils/ApiError.js';
import { sendNotification } from '../services/notificationService.js';

// @desc    Submit a claim for a found item (Student)
// @route   POST /api/claims
export const submitClaim = asyncHandler(async (req, res) => {
  const { foundItemId, lostItemId, explanation, identifyingEvidence, proofFiles } = req.body;

  if (!foundItemId || !explanation || !identifyingEvidence) {
    throw new ApiError(400, 'Please provide found item ID, explanation, and identifying evidence.');
  }

  const foundItem = await FoundItem.findById(foundItemId);
  if (!foundItem) {
    throw new ApiError(404, 'The requested found item was not found.');
  }

  if (foundItem.status === 'returned' || foundItem.status === 'archived') {
    throw new ApiError(400, 'This item is no longer available for claiming.');
  }

  // Prevent multiple active claims from the same student for the same found item
  const existingClaim = await Claim.findOne({
    foundItem: foundItemId,
    claimant: req.user._id,
    status: { $in: ['pending', 'under_review', 'additional_information_requested', 'approved'] },
  });

  if (existingClaim) {
    throw new ApiError(409, 'You already have an active claim under review for this item.');
  }

  const claim = await Claim.create({
    foundItem: foundItemId,
    lostItem: lostItemId || null,
    claimant: req.user._id,
    explanation,
    identifyingEvidence,
    proofFiles: proofFiles || [],
    status: 'pending',
  });

  // Update found item status to claim_pending
  if (foundItem.status === 'in_custody') {
    foundItem.status = 'claim_pending';
    await foundItem.save();
  }

  // Notify student
  await sendNotification({
    recipient: req.user._id,
    title: 'Claim Submitted Successfully',
    message: `Your ownership claim for "${foundItem.internalItemName}" has been submitted for staff verification.`,
    type: 'claim',
    relatedClaim: claim._id,
    relatedItem: foundItem._id,
  });

  res.status(201).json({
    success: true,
    message: 'Ownership claim submitted successfully. Staff will review your evidence.',
    claim,
  });
});

// @desc    Get current user's submitted claims
// @route   GET /api/claims/my
export const getMyClaims = asyncHandler(async (req, res) => {
  const claims = await Claim.find({ claimant: req.user._id })
    .populate({
      path: 'foundItem',
      select: '-storageLocation -handoverNotes', // strip staff private info
    })
    .populate('reviewedBy', 'name email department')
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    total: claims.length,
    claims,
  });
});

// @desc    Get single claim details by ID
// @route   GET /api/claims/:id
export const getClaimById = asyncHandler(async (req, res) => {
  const claim = await Claim.findById(req.params.id)
    .populate('claimant', 'name email phone collegeId department avatar')
    .populate('foundItem')
    .populate('reviewedBy', 'name email department');

  if (!claim) {
    throw new ApiError(404, 'Claim record not found.');
  }

  const userRole = req.user.role === 'faculty' ? 'staff' : req.user.role;
  const isClaimant = claim.claimant && claim.claimant._id.toString() === req.user._id.toString();

  // Strict privacy: other students cannot view claims
  if (!isClaimant && userRole !== 'staff' && userRole !== 'admin') {
    throw new ApiError(403, 'Forbidden: You do not have permission to view another student’s claim details.');
  }

  // If student views, redact storage location from populated foundItem
  let claimData = claim.toObject();
  if (!['staff', 'admin'].includes(userRole) && claimData.foundItem) {
    delete claimData.foundItem.storageLocation;
    delete claimData.foundItem.handoverNotes;
  }

  res.json({
    success: true,
    claim: claimData,
  });
});

// @desc    Get all claims for staff review (Staff/Admin)
// @route   GET /api/staff/claims
export const getStaffClaims = asyncHandler(async (req, res) => {
  const { status } = req.query;
  const filter = {};

  if (status && status !== 'all') {
    filter.status = status;
  }

  const claims = await Claim.find(filter)
    .populate('claimant', 'name email phone collegeId department avatar')
    .populate('foundItem')
    .populate('reviewedBy', 'name email department')
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    total: claims.length,
    claims,
  });
});

// @desc    Review a claim (Staff/Admin: Under Review, Request Info, Approve, Reject)
// @route   PATCH /api/staff/claims/:id/review
export const reviewClaim = asyncHandler(async (req, res) => {
  const { status, reviewRemark } = req.body;

  if (!status || !['under_review', 'additional_information_requested', 'approved', 'rejected'].includes(status)) {
    throw new ApiError(400, 'Valid status required: under_review, additional_information_requested, approved, or rejected.');
  }

  const claim = await Claim.findById(req.params.id).populate('foundItem');
  if (!claim) {
    throw new ApiError(404, 'Claim not found.');
  }

  claim.status = status;
  claim.reviewRemark = reviewRemark || '';
  claim.reviewedBy = req.user._id;
  claim.reviewedAt = new Date();
  await claim.save();

  // If approved, update found item status to 'approved_for_handover' (NOT returned yet!)
  if (status === 'approved' && claim.foundItem) {
    await FoundItem.findByIdAndUpdate(claim.foundItem._id, {
      status: 'approved_for_handover',
    });
  } else if (status === 'rejected' && claim.foundItem) {
    // Check if there are other pending claims
    const otherPending = await Claim.findOne({
      foundItem: claim.foundItem._id,
      _id: { $ne: claim._id },
      status: { $in: ['pending', 'under_review', 'approved'] },
    });
    if (!otherPending) {
      await FoundItem.findByIdAndUpdate(claim.foundItem._id, { status: 'in_custody' });
    }
  }

  // Audit log
  await AuditLog.create({
    actor: req.user._id,
    action: `CLAIM_${status.toUpperCase()}`,
    targetType: 'Claim',
    targetId: claim._id.toString(),
    summary: `Staff '${req.user.name}' updated claim #${claim._id.toString().slice(-6)} to '${status}'`,
    details: { reviewRemark },
  });

  // Notification to student
  const statusTitles = {
    under_review: 'Claim Under Review',
    additional_information_requested: 'Additional Proof Requested for Claim',
    approved: '🎉 Claim Approved! Handover Ready',
    rejected: 'Claim Verification Decision',
  };

  await sendNotification({
    recipient: claim.claimant,
    title: statusTitles[status] || 'Claim Status Updated',
    message: `Your claim has been updated to "${status.replace(/_/g, ' ')}". ${reviewRemark || ''}`,
    type: 'claim',
    relatedClaim: claim._id,
    relatedItem: claim.foundItem ? claim.foundItem._id : null,
  });

  res.json({
    success: true,
    message: `Claim successfully marked as ${status}.`,
    claim,
  });
});

// @desc    Confirm verified physical handover of found item to claimant (Staff/Admin)
// @route   PATCH /api/staff/claims/:id/handover
export const confirmHandover = asyncHandler(async (req, res) => {
  const { handoverNotes } = req.body;

  const claim = await Claim.findById(req.params.id).populate('foundItem').populate('claimant');
  if (!claim) {
    throw new ApiError(404, 'Claim not found.');
  }

  if (claim.status !== 'approved') {
    throw new ApiError(400, 'Handover can only be confirmed for claims that have been approved by staff.');
  }

  const now = new Date();

  // Mark claim completed
  claim.status = 'completed';
  claim.handoverConfirmedAt = now;
  await claim.save();

  // Mark found item as officially returned
  if (claim.foundItem) {
    await FoundItem.findByIdAndUpdate(claim.foundItem._id, {
      status: 'returned',
      handedOverTo: claim.claimant._id,
      handoverConfirmedBy: req.user._id,
      handoverConfirmedAt: now,
      handoverNotes: handoverNotes || 'Handover physically verified and completed at campus security desk.',
    });
  }

  // Audit Log
  await AuditLog.create({
    actor: req.user._id,
    action: 'CONFIRM_HANDOVER',
    targetType: 'FoundItem',
    targetId: claim.foundItem._id.toString(),
    summary: `Staff '${req.user.name}' confirmed physical handover of item '${claim.foundItem.internalItemName}' to student '${claim.claimant.name}'`,
    details: { handoverNotes, claimantId: claim.claimant._id.toString() },
  });

  // Notification to student
  await sendNotification({
    recipient: claim.claimant._id,
    title: 'Item Handover Confirmed',
    message: `Your item "${claim.foundItem.internalItemName}" has been officially handed over. Thank you for using CampusFind!`,
    type: 'handover',
    relatedClaim: claim._id,
    relatedItem: claim.foundItem._id,
  });

  res.json({
    success: true,
    message: 'Physical handover confirmed successfully. Item status marked as RETURNED.',
    claim,
  });
});
