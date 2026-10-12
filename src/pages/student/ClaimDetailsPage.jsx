import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { claimService } from '../../services/claimService';
import ClaimStatus from '../../components/claims/ClaimStatus';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  ShieldAlert,
  FileText,
  User,
  Building,
} from 'lucide-react';
import { formatDate, formatDateTime } from '../../utils/formatters';

const ClaimDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [claim, setClaim] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClaim = async () => {
      try {
        setLoading(true);
        const res = await claimService.getById(id);
        setClaim(res.claim || null);
      } catch (err) {
        console.error('Failed to fetch claim:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchClaim();
  }, [id]);

  if (loading) {
    return <LoadingSpinner size="lg" message="Loading claim verification status..." />;
  }

  if (!claim) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center max-w-md mx-auto">
        <h2 className="text-lg font-bold text-slate-800">Claim Not Found</h2>
        <button
          onClick={() => navigate('/student/my-claims')}
          className="text-xs font-bold text-blue-600 hover:underline mt-2 inline-block"
        >
          Return to My Claims
        </button>
      </div>
    );
  }

  const foundItem = claim.foundItem || {};

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to My Claims
      </button>

      {/* Main Status Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Claim Reference #{claim._id?.toString().slice(-6) || '---'}
            </span>
            <h1 className="text-2xl font-black text-slate-900 mt-1">
              {foundItem.internalItemName || foundItem.title || 'Found Item Claim'}
            </h1>
          </div>
          <ClaimStatus status={claim.status} />
        </div>

        {/* Visual Progress Stepper */}
        <div className="pt-6">
          <ClaimStatus status={claim.status} showTimeline={true} />
        </div>
      </div>

      {/* Staff Review Decision Box (if reviewed) */}
      {claim.reviewRemark && (
        <div className="bg-blue-50/70 border border-blue-200 rounded-3xl p-6 shadow-xs flex items-start gap-4">
          <div className="p-3 bg-blue-100 text-blue-700 rounded-2xl shrink-0">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-blue-900">Campus Staff Remark</h3>
            <p className="text-xs text-blue-800 mt-1 leading-relaxed">{claim.reviewRemark}</p>
            {claim.reviewedBy && (
              <span className="text-[11px] font-semibold text-blue-600 block mt-2">
                Reviewed by: {claim.reviewedBy.name || 'Campus Security Desk'} • {formatDate(claim.reviewedAt)}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Handover Notice if Approved */}
      {claim.status === 'approved' && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-6 text-emerald-900">
          <h4 className="text-sm font-bold flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            Physical Handover Next Steps
          </h4>
          <p className="text-xs text-emerald-800 mt-1.5 leading-relaxed">
            Your ownership claim has been verified and approved. Please visit the <strong>Central Campus Security & Lost Property Desk</strong> with your official college ID card to complete physical verification and collection.
          </p>
        </div>
      )}

      {/* Submitted Evidence Summary */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
          <FileText className="w-4 h-4 text-blue-600" />
          Your Submitted Claim Evidence
        </h3>

        <div className="space-y-3 text-xs">
          <div>
            <span className="font-semibold text-slate-700 block mb-1">Ownership Explanation:</span>
            <p className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 text-slate-800 leading-relaxed">
              {claim.explanation}
            </p>
          </div>

          <div>
            <span className="font-semibold text-slate-700 block mb-1">Unique Identifying Features:</span>
            <p className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 text-slate-800 leading-relaxed">
              {claim.identifyingEvidence}
            </p>
          </div>

          {claim.proofFiles && claim.proofFiles.length > 0 && (
            <div>
              <span className="font-semibold text-slate-700 block mb-2">Attached Proof Documents:</span>
              <div className="flex flex-wrap gap-3">
                {claim.proofFiles.map((f, idx) => (
                  <a
                    key={idx}
                    href={f}
                    target="_blank"
                    rel="noreferrer"
                    className="w-24 h-24 rounded-xl border border-slate-200 overflow-hidden block hover:opacity-90"
                  >
                    <img src={f} alt={`Proof ${idx + 1}`} className="w-full h-full object-cover" />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClaimDetailsPage;
