import React, { useState, useEffect } from 'react';
import { claimService } from '../../services/claimService';
import { useToast } from '../../context/ToastContext';
import StatusBadge from '../../components/common/StatusBadge';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import Textarea from '../../components/common/Textarea';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import { FileCheck, ShieldCheck, XCircle, CheckCircle2, User, Eye, AlertTriangle, Lock } from 'lucide-react';
import { formatDate } from '../../utils/formatters';
import { getItemImage } from '../../utils/itemImageHelper';

const AdminClaimsPage = () => {
  const toast = useToast();
  const showSuccess = toast?.showToast ? (m) => toast.showToast(m, 'success') : toast?.showSuccess || console.log;
  const showError = toast?.showToast ? (m) => toast.showToast(m, 'error') : toast?.showError || console.error;

  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [adminRemark, setAdminRemark] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const fetchClaims = async () => {
    setLoading(true);
    try {
      const data = await claimService.getAllClaims();
      setClaims(Array.isArray(data) ? data : []);
    } catch (err) {
      showError('Failed to fetch claims list');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClaims();
  }, []);

  const handleUpdateStatus = async (status) => {
    if (!selectedClaim) return;
    const claimId = selectedClaim._id || selectedClaim.id;
    setActionLoading(true);
    try {
      await claimService.updateClaimStatus(
        claimId,
        status,
        adminRemark || (status === 'approved' ? 'Claim verified. Owner may pick up at Security Desk Room 104.' : 'Claim rejected due to unmatched proof features.')
      );
      showSuccess(`Claim status updated to ${status.toUpperCase()}`);
      setSelectedClaim(null);
      setAdminRemark('');
      fetchClaims();
    } catch (err) {
      showError(err.message || 'Failed to update claim');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <LoadingSkeleton type="details" />;

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-soft">
        <h1 className="text-2xl font-black text-slate-900">Claim Verification & Approval</h1>
        <p className="text-xs text-slate-500 mt-1">
          Inspect ownership proof submitted by claimants and verify physical handover protocols.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-soft">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 uppercase text-[10px] font-bold text-slate-400 tracking-wider border-b border-slate-100">
              <tr>
                <th className="p-4">Claimant Details</th>
                <th className="p-4">Claimed Item</th>
                <th className="p-4">Submitted Date</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Review Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {claims.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-400 font-medium">
                    No claims submitted yet.
                  </td>
                </tr>
              ) : (
                claims.map((claim) => {
                  const claimId = claim._id || claim.id;
                  const item = claim.foundItem || {};
                  const itemName = item.internalItemName || item.title || claim.itemTitle || 'Found Item';
                  const itemImg = getItemImage({
                    ...item,
                    title: itemName,
                    image: claim.itemImage || item.image,
                    images: claim.itemImage ? [claim.itemImage] : item.images,
                  });

                  return (
                    <tr key={claimId} className="hover:bg-slate-50/70 transition-colors">
                      <td className="p-4 font-bold text-slate-900">
                        <p className="text-sm">{claim.claimant?.name || 'Claimant'}</p>
                        <p className="text-[10px] text-slate-400 font-normal">
                          {claim.claimant?.email || 'N/A'} | {claim.claimant?.collegeId || claim.claimant?.studentId || 'ID'}
                        </p>
                      </td>
                      <td className="p-4 font-medium text-slate-800 flex items-center gap-3">
                        <img src={itemImg} alt="" className="w-9 h-9 rounded-xl object-cover border border-slate-100 shrink-0" />
                        <span className="truncate max-w-xs">{itemName}</span>
                      </td>
                      <td className="p-4 font-medium text-slate-500">
                        {formatDate(claim.createdAt || claim.claimDate)}
                      </td>
                      <td className="p-4">
                        <StatusBadge status={claim.status} />
                      </td>
                      <td className="p-4 text-right">
                        <Button
                          variant="primary"
                          size="sm"
                          icon={Eye}
                          onClick={() => {
                            setSelectedClaim(claim);
                            setAdminRemark(claim.reviewRemark || '');
                          }}
                        >
                          Inspect Evidence
                        </Button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Claim Detail Modal */}
      {selectedClaim && (
        <Modal
          isOpen={!!selectedClaim}
          onClose={() => setSelectedClaim(null)}
          title={`Claim Verification #${(selectedClaim._id || selectedClaim.id)?.toString().slice(-6)}`}
        >
          <div className="space-y-4 text-xs text-slate-600">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2">
              <h4 className="font-bold text-slate-900 text-sm">
                Property: {selectedClaim.foundItem?.internalItemName || selectedClaim.foundItem?.title || 'Found Property'}
              </h4>
              <p><span className="font-semibold text-slate-700">Claimant:</span> {selectedClaim.claimant?.name} ({selectedClaim.claimant?.email})</p>
              <p><span className="font-semibold text-slate-700">Department:</span> {selectedClaim.claimant?.department || 'General'}</p>
              {selectedClaim.foundItem?.storageLocation && (
                <p className="text-amber-800 font-mono">
                  <Lock className="w-3.5 h-3.5 inline mr-1 text-amber-600" />
                  Storage: {selectedClaim.foundItem.storageLocation}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <span className="font-bold text-slate-800 block uppercase tracking-wider text-[11px]">Ownership Explanation:</span>
              <p className="bg-slate-50 p-3 rounded-xl border border-slate-100 leading-relaxed">
                {selectedClaim.explanation || 'No explanation provided.'}
              </p>
            </div>

            <div className="space-y-1">
              <span className="font-bold text-slate-800 block uppercase tracking-wider text-[11px]">Private Identifying Evidence:</span>
              <p className="bg-blue-50/50 text-blue-900 p-3 rounded-xl border border-blue-100 leading-relaxed font-medium">
                {selectedClaim.identifyingEvidence || 'No specific marks detailed.'}
              </p>
            </div>

            {selectedClaim.proofFiles?.length > 0 && (
              <div className="space-y-1">
                <span className="font-bold text-slate-800 block uppercase tracking-wider text-[11px]">Proof Documents & Photos:</span>
                <div className="flex flex-wrap gap-2 pt-1">
                  {selectedClaim.proofFiles.map((f, i) => (
                    <a key={i} href={f} target="_blank" rel="noreferrer" className="block">
                      <img src={f} alt="proof" className="w-20 h-20 rounded-xl object-cover border border-slate-200 hover:scale-105 transition-transform" />
                    </a>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-1 pt-2">
              <label className="font-bold text-slate-800 block uppercase tracking-wider text-[11px]">
                Administrator Decision Remark:
              </label>
              <Textarea
                value={adminRemark}
                onChange={(e) => setAdminRemark(e.target.value)}
                placeholder="Enter review decision notes, collection instructions, or reason for rejection..."
                rows={3}
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
              <Button
                variant="danger"
                size="sm"
                loading={actionLoading}
                onClick={() => handleUpdateStatus('rejected')}
              >
                Reject Claim
              </Button>
              <Button
                variant="primary"
                size="sm"
                loading={actionLoading}
                onClick={() => handleUpdateStatus('approved')}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                Approve for Handover
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default AdminClaimsPage;
