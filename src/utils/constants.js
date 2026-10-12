export const ROLES = {
  STUDENT: 'student',
  STAFF: 'staff',
  ADMIN: 'admin',
};

export const ITEM_STATUS = {
  LOST: {
    PENDING_REVIEW: 'pending_review',
    APPROVED: 'approved',
    REJECTED: 'rejected',
    RESOLVED: 'resolved',
  },
  FOUND: {
    IN_CUSTODY: 'in_custody',
    CLAIM_PENDING: 'claim_pending',
    APPROVED_FOR_HANDOVER: 'approved_for_handover',
    RETURNED: 'returned',
    ARCHIVED: 'archived',
  },
};

export const CLAIM_STATUS = {
  PENDING: 'pending',
  UNDER_REVIEW: 'under_review',
  ADDITIONAL_INFO: 'additional_information_requested',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  COMPLETED: 'completed',
};

export const STATUS_COLORS = {
  // Lost item statuses
  pending_review: 'bg-amber-50 text-amber-700 border-amber-200',
  approved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  rejected: 'bg-rose-50 text-rose-700 border-rose-200',
  resolved: 'bg-blue-50 text-blue-700 border-blue-200',

  // Found item statuses
  in_custody: 'bg-blue-50 text-blue-700 border-blue-200',
  claim_pending: 'bg-amber-50 text-amber-700 border-amber-200',
  approved_for_handover: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  returned: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  archived: 'bg-slate-50 text-slate-700 border-slate-200',

  // Claim statuses
  pending: 'bg-amber-50 text-amber-700 border-amber-200',
  under_review: 'bg-blue-50 text-blue-700 border-blue-200',
  additional_information_requested: 'bg-purple-50 text-purple-700 border-purple-200',
  completed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
};

export const STATUS_LABELS = {
  pending_review: 'Pending Review',
  approved: 'Approved',
  rejected: 'Rejected',
  resolved: 'Resolved',
  in_custody: 'In Custody',
  claim_pending: 'Claim Pending',
  approved_for_handover: 'Ready for Handover',
  returned: 'Returned',
  archived: 'Archived',
  pending: 'Pending',
  under_review: 'Under Review',
  additional_information_requested: 'Proof Requested',
  completed: 'Handover Completed',
};
