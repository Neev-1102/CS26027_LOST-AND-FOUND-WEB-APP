import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Calendar, ArrowRight, ShieldAlert } from 'lucide-react';
import ClaimStatus from './ClaimStatus';
import { formatDate } from '../../utils/formatters';

const ClaimCard = ({ claim, isStaffView = false }) => {
  const claimId = claim?._id || claim?.id;
  const foundItem = claim?.foundItem || {};
  const itemName = foundItem.internalItemName || foundItem.title || 'Found Property';
  const detailLink = isStaffView ? `/staff/claims/${claimId}` : `/student/claims/${claimId}`;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <span className="text-[11px] font-semibold uppercase text-slate-500 tracking-wider">
              Claim #{claimId?.toString().slice(-6) || '---'}
            </span>
            <h3 className="text-base font-bold text-slate-900 mt-0.5">{itemName}</h3>
          </div>
          <ClaimStatus status={claim.status} />
        </div>

        {isStaffView && claim.claimant && (
          <div className="bg-slate-50 rounded-xl p-3 mb-3 text-xs text-slate-600 flex items-center justify-between">
            <span className="font-semibold text-slate-800">{claim.claimant.name}</span>
            <span className="text-slate-500">{claim.claimant.department || claim.claimant.collegeId}</span>
          </div>
        )}

        <p className="text-xs text-slate-600 line-clamp-2 mb-3 bg-slate-50/70 p-2.5 rounded-xl border border-slate-100">
          <span className="font-semibold text-slate-700">Evidence: </span>
          {claim.identifyingEvidence || claim.explanation}
        </p>

        {claim.reviewRemark && (
          <div className="mb-3 p-2.5 bg-blue-50/60 border border-blue-100 rounded-xl text-xs text-blue-800 flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Staff Remark: </span>
              {claim.reviewRemark}
            </div>
          </div>
        )}

        <div className="flex items-center gap-2 text-xs text-slate-400 mb-4">
          <Calendar className="w-3.5 h-3.5" />
          <span>Submitted on {formatDate(claim.createdAt)}</span>
        </div>
      </div>

      <Link
        to={detailLink}
        className="inline-flex items-center justify-center gap-2 py-2 px-4 rounded-xl text-xs font-semibold bg-slate-50 hover:bg-blue-600 hover:text-white text-slate-700 transition-colors w-full"
      >
        <span>{isStaffView ? 'Review Claim & Evidence' : 'View Claim Progress'}</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </Link>
    </div>
  );
};

export default ClaimCard;
