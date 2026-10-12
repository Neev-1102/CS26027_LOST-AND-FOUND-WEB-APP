import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { claimService } from '../../services/claimService';
import { useToast } from '../../context/ToastContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Button from '../../components/common/Button';
import Textarea from '../../components/common/Textarea';
import {
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
  UserCheck,
  PackageCheck,
  Lock,
} from 'lucide-react';

const HandoverConfirmationPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [claim, setClaim] = useState(null);
  const [loading, setLoading] = useState(true);
  const [handoverNotes, setHandoverNotes] = useState('Student verified identity with institutional college ID card. Serial number and physical characteristics inspected. Item returned in good condition.');
  const [idVerified, setIdVerified] = useState(false);
  const [itemInspected, setItemInspected] = useState(false);
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    const fetchClaim = async () => {
      try {
        setLoading(true);
        const res = await claimService.getById(id);
        setClaim(res.claim || null);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchClaim();
  }, [id]);

  const handleConfirmHandover = async () => {
    if (!idVerified || !itemInspected) {
      showToast('Please check both verification checkboxes before confirming handover.', 'error');
      return;
    }

    setConfirming(true);
    try {
      await claimService.confirmHandover(claim._id || claim.id, { handoverNotes });
      showToast('Physical handover confirmed! Item status marked as RETURNED.', 'success');
      navigate('/staff/claims');
    } catch (err) {
      showToast(err.message || 'Failed to confirm handover', 'error');
    } finally {
      setConfirming(false);
    }
  };

  if (loading) {
    return <LoadingSpinner size="lg" message="Loading handover verification details..." />;
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

  const claimant = claim.claimant || {};
  const foundItem = claim.foundItem || {};

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Review
      </button>

      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="border-b border-slate-100 pb-6">
          <div className="flex items-center gap-2 text-emerald-600 text-xs font-bold uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4" /> Physical Custody Handover Verification
          </div>
          <h1 className="text-2xl font-black text-slate-900">Confirm Item Handover</h1>
          <p className="text-xs text-slate-500 mt-1">
            This action changes the item status to <strong>RETURNED</strong> and creates an immutable audit trail.
          </p>
        </div>

        {/* Verification Checkpoint Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <UserCheck className="w-3.5 h-3.5 text-blue-600" /> Authorized Claimant
            </span>
            <h4 className="text-sm font-bold text-slate-900">{claimant.name}</h4>
            <p className="text-xs text-slate-500">{claimant.email}</p>
            <p className="text-xs font-semibold text-slate-700">ID: {claimant.collegeId || claimant.studentId || 'N/A'}</p>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <PackageCheck className="w-3.5 h-3.5 text-emerald-600" /> Item & Locker
            </span>
            <h4 className="text-sm font-bold text-slate-900">{foundItem.internalItemName || foundItem.title}</h4>
            <p className="text-xs text-slate-500">{foundItem.category}</p>
            <p className="text-xs font-mono font-semibold text-amber-800">
              <Lock className="w-3 h-3 inline mr-1 text-amber-600" />
              {foundItem.storageLocation || 'Security Desk'}
            </p>
          </div>
        </div>

        {/* Mandatory Checkboxes */}
        <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-5 space-y-3">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={idVerified}
              onChange={(e) => setIdVerified(e.target.checked)}
              className="mt-1 w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
            />
            <span className="text-xs text-emerald-950 font-medium">
              I have physically inspected the student's institutional photo ID card ({claimant.collegeId || claimant.name}) and verified identity.
            </span>
          </label>

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={itemInspected}
              onChange={(e) => setItemInspected(e.target.checked)}
              className="mt-1 w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
            />
            <span className="text-xs text-emerald-950 font-medium">
              The claimant has confirmed and tested the item condition, and possession has been officially transferred.
            </span>
          </label>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">
            Audit Handover Confirmation Notes
          </label>
          <Textarea
            value={handoverNotes}
            onChange={(e) => setHandoverNotes(e.target.value)}
            rows={3}
            required
          />
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
          <Button variant="secondary" onClick={() => navigate(-1)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            loading={confirming}
            onClick={handleConfirmHandover}
            icon={CheckCircle2}
            className="bg-emerald-600 hover:bg-emerald-700 font-bold"
          >
            Confirm Verified Handover
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HandoverConfirmationPage;
