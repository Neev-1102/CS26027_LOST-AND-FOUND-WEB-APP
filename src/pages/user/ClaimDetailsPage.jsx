import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { claimService } from '../../services/claimService';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import ErrorState from '../../components/common/ErrorState';
import {
  ArrowLeft,
  FileCheck,
  ShieldAlert,
  Calendar,
  User,
  Phone,
  Mail,
  CreditCard,
  Building,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';

const ClaimDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [claim, setClaim] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClaim = async () => {
      setLoading(true);
      try {
        const found = await claimService.getById(id);
        setClaim(found);
      } catch (err) {
        console.error(err);
        // Fallback to user claims
        try {
          const claims = await claimService.getUserClaims();
          setClaim(claims[0] || null);
        } catch (fallbackErr) {
          console.error(fallbackErr);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchClaim();
  }, [id]);

  if (loading) return <LoadingSkeleton type="details" />;

  if (!claim) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4">
        <ErrorState
          title="Claim Not Found"
          description="The requested ownership claim record does not exist or has expired."
          onRetry={() => navigate('/claims')}
        />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-6">
      <button
        onClick={() => navigate('/claims')}
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-blue-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to My Claims</span>
      </button>

      {/* Header */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono text-slate-400">Claim ID: {claim.id}</span>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
            Ownership Claim Details
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Submitted on {claim.claimDate} for verified property retrieval
          </p>
        </div>

        <div className="self-start sm:self-center">
          <StatusBadge status={claim.status} />
        </div>
      </div>

      {/* Item info */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-soft space-y-6">
        <div className="flex gap-4 sm:gap-6 items-start pb-6 border-b border-slate-100">
          <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl overflow-hidden bg-slate-100 flex-shrink-0 border border-slate-200">
            <img
              src={claim.itemImage}
              alt={claim.itemTitle}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex-1 min-w-0 space-y-2">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
              Claimed Found Property
            </span>
            <h2 className="text-xl font-bold text-slate-900 leading-snug">
              {claim.itemTitle}
            </h2>

            <Link
              to={`/found-items/${claim.itemId}`}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:underline pt-1"
            >
              <span>View Original Listing</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Claim Evidence & Reasons */}
        <div className="space-y-4">
          <div>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Reason / Circumstances of Loss
            </h3>
            <p className="text-xs text-slate-800 bg-slate-50 p-3.5 rounded-xl border border-slate-100 mt-1.5 leading-relaxed">
              {claim.reason}
            </p>
          </div>

          <div>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Secret Identifying Features / Serial Marks
            </h3>
            <p className="text-xs text-slate-800 bg-slate-50 p-3.5 rounded-xl border border-slate-100 mt-1.5 leading-relaxed">
              {claim.uniqueFeature || 'None provided.'}
            </p>
          </div>

          {claim.proofImage && (
            <div>
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Attached Supporting Proof Image
              </h3>
              <div className="w-48 h-48 rounded-xl overflow-hidden border border-slate-200">
                <img
                  src={claim.proofImage}
                  alt="Proof"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}

          {claim.adminRemark && (
            <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200">
              <h3 className="text-xs font-bold text-blue-900 uppercase tracking-wider">
                Campus Security Staff Remark
              </h3>
              <p className="text-xs text-blue-800 mt-1">
                {claim.adminRemark}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClaimDetailsPage;
