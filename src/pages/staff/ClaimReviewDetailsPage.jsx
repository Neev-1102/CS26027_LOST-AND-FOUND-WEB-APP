import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { claimService } from '../../services/claimService';
import { useToast } from '../../context/ToastContext';
import ClaimStatus from '../../components/claims/ClaimStatus';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Button from '../../components/common/Button';
import Textarea from '../../components/common/Textarea';
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Clock,
  Lock,
  FileText,
  User,
  ShieldCheck,
} from 'lucide-react';
import { formatDate } from '../../utils/formatters';

const ClaimReviewDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [claim, setClaim] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviewRemark, setReviewRemark] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchClaim = async () => {
      try {
        setLoading(true);
        const res = await claimService.getById(id);
        setClaim(res.claim || null);
        if (res.claim?.reviewRemark) {
          setReviewRemark(res.claim.reviewRemark);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchClaim();
  }, [id]);

  const handleUpdateStatus = async (status) => {
    setUpdating(true);
    try {
      await claimService.reviewClaim(claim._id || claim.id, {
        status,
        reviewRemark,
      });
      showToast(`Claim marked as ${status.replace(/_/g, ' ').toUpperCase()}`, 'success');
      navigate('/staff/claims');
    } catch (err) {
      showToast(err.message || 'Failed to update claim review', 'error');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return <LoadingSpinner size="lg" message="Loading claim and evidence..." />;
  }

  if (!claim) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center max-w-md mx-auto">
        <h2 className="text-lg font-bold text-slate-800">Claim Record Not Found</h2>
        <button onClick={() => navigate('/staff/claims')} className="text-xs font-bold text-blue-600 mt-2">
          Back to Claims
        </button>
      </div>
    );
  }

  const foundItem = claim.foundItem || {};
  const claimant = claim.claimant || {};

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <button
        onClick={() => navigate('/staff/claims')}
        className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Claim Management
      </button>

      {/* Header */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Claim #{claim._id?.toString().slice(-6) || '---'}
          </span>
          <h1 className="text-2xl font-black text-slate-900 mt-1">Review Ownership Evidence</h1>
          <p className="text-xs text-slate-500">Submitted on {formatDate(claim.createdAt)}</p>
        </div>
        <ClaimStatus status={claim.status} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Claimant & Found Item Details */}
        <div className="lg:col-span-5 space-y-6">
          {/* Claimant Profile Card */}
          <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-blue-600" /> Claimant Information
            </h3>
            <div className="flex items-center gap-3 pt-2">
              <img
                src={claimant.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300'}
                alt=""
                className="w-12 h-12 rounded-2xl object-cover border border-slate-100"
              />
              <div>
                <h4 className="text-sm font-bold text-slate-900">{claimant.name}</h4>
                <p className="text-xs text-slate-500">{claimant.email}</p>
                <span className="text-[11px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full inline-block mt-1">
                  ID: {claimant.collegeId || claimant.studentId || 'N/A'} • {claimant.department}
                </span>
              </div>
            </div>
            {claimant.phone && (
              <p className="text-xs text-slate-600 pt-2 border-t border-slate-100">
                Phone: <span className="font-semibold">{claimant.phone}</span>
              </p>
            )}
          </div>

          {/* Found Item Custody Card */}
          <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Custody Item Record
            </h3>
            <div>
              <h4 className="text-base font-bold text-slate-900">{foundItem.internalItemName || foundItem.title}</h4>
              <p className="text-xs text-slate-500">{foundItem.category}</p>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-900 space-y-1">
              <span className="font-bold flex items-center gap-1 text-amber-800">
                <Lock className="w-3.5 h-3.5" /> Confidential Locker:
              </span>
              <p className="font-mono font-semibold">{foundItem.storageLocation || 'Security Desk Safe A'}</p>
            </div>
          </div>
        </div>

        {/* Right Column: Evidence & Decision Box */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-600" />
              Student Ownership Evidence
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <span className="font-bold text-slate-700 block mb-1">Loss Explanation:</span>
                <p className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 text-slate-800 leading-relaxed">
                  {claim.explanation}
                </p>
              </div>

              <div>
                <span className="font-bold text-slate-700 block mb-1">Unique Identifying Features:</span>
                <p className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 text-slate-800 leading-relaxed">
                  {claim.identifyingEvidence}
                </p>
              </div>

              {claim.proofFiles && claim.proofFiles.length > 0 && (
                <div>
                  <span className="font-bold text-slate-700 block mb-1.5">Attached Proof Photos / Documents:</span>
                  <div className="flex flex-wrap gap-3">
                    {claim.proofFiles.map((f, idx) => (
                      <a
                        key={idx}
                        href={f}
                        target="_blank"
                        rel="noreferrer"
                        className="w-24 h-24 rounded-xl border border-slate-200 overflow-hidden block hover:opacity-90"
                      >
                        <img src={f} alt="" className="w-full h-full object-cover" />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Decision Controls */}
            <div className="pt-4 border-t border-slate-100 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">
                  Staff Review Remark / Feedback
                </label>
                <Textarea
                  placeholder="Enter remarks for the student (e.g., 'Serial numbers match. Bring college ID to Central Security Desk.')..."
                  value={reviewRemark}
                  onChange={(e) => setReviewRemark(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-2">
                <Button
                  variant="primary"
                  loading={updating}
                  onClick={() => handleUpdateStatus('approved')}
                  icon={CheckCircle2}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  Approve Claim
                </Button>

                <Button
                  variant="secondary"
                  loading={updating}
                  onClick={() => handleUpdateStatus('additional_information_requested')}
                  icon={HelpCircle}
                  className="text-purple-700 bg-purple-50 hover:bg-purple-100 border-purple-200"
                >
                  Request More Proof
                </Button>

                <Button
                  variant="secondary"
                  loading={updating}
                  onClick={() => handleUpdateStatus('under_review')}
                  icon={Clock}
                >
                  Mark Under Review
                </Button>

                <Button
                  variant="danger"
                  loading={updating}
                  onClick={() => handleUpdateStatus('rejected')}
                  icon={XCircle}
                >
                  Reject Claim
                </Button>
              </div>

              {claim.status === 'approved' && (
                <div className="mt-4 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-900">
                    Claim is approved! Proceed to confirmed physical handover.
                  </span>
                  <Link to={`/staff/claims/${claim._id || claim.id}/handover`}>
                    <Button variant="primary" size="sm" className="bg-emerald-600 hover:bg-emerald-700 font-bold">
                      Confirm Handover
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClaimReviewDetailsPage;
