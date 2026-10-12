import React, { useState, useEffect } from 'react';
import { claimService } from '../../services/claimService';
import { useToast } from '../../context/ToastContext';
import StatusBadge from '../../components/common/StatusBadge';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import Textarea from '../../components/common/Textarea';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import { FileCheck, ShieldCheck, XCircle, CheckCircle2, User, Eye, AlertTriangle } from 'lucide-react';

const AdminClaimsPage = () => {
  const { showSuccess, showError } = useToast();
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [adminRemark, setAdminRemark] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const fetchClaims = async () => {
    setLoading(true);
    try {
      const data = await claimService.getAllClaims();
      setClaims(data);
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
    setActionLoading(true);
    try {
      await claimService.updateClaimStatus(
        selectedClaim.id,
        status,
        adminRemark || (status === 'Approved' ? 'Claim verified. Owner may pick up at Security Desk Room 104.' : 'Claim rejected due to unmatched proof features.')
      );
      showSuccess(`Claim status updated to ${status}`);
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
              {claims.map((claim) => (
                <tr key={claim.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="p-4 font-bold text-slate-900">
                    <p className="text-sm">{claim.claimant?.name || 'Claimant'}</p>
                    <p className="text-[10px] text-slate-400 font-normal">{claim.claimant?.email || 'N/A'} | {claim.claimant?.studentId || 'ID'}</p>
                  </td>
                  <td className="p-4 font-medium text-slate-800 flex items-center gap-3">
                    <img src={claim.itemImage} alt="" className="w-8 h-8 rounded-lg object-cover border" />
                    <span className="truncate max-w-xs">{claim.itemTitle}</span>
                  </td>
                  <td className="p-4 font-medium text-slate-500">{claim.claimDate}</td>
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
                        setAdminRemark(claim.adminRemark || '');
                      }}
                    >
                      Review Claim
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Claim Detailed Inspector & Action Modal */}
      <Modal
        isOpen={!!selectedClaim}
        onClose={() => setSelectedClaim(null)}
        title="Admin Claim Inspection & Verification"
        subtitle={`Claim Reference: ${selectedClaim?.id}`}
        maxWidth="max-w-2xl"
      >
        {selectedClaim && (
          <div className="space-y-5 text-xs">
            
            {/* Claimant & Item Header Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Claimant Identity</span>
                <p className="font-bold text-slate-900 text-sm">{selectedClaim.claimant.name}</p>
                <p className="text-slate-500">{selectedClaim.claimant.email}</p>
                <p className="text-slate-500">ID: {selectedClaim.claimant.studentId} | Phone: {selectedClaim.claimant.phone}</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Target Belonging</span>
                <p className="font-bold text-slate-900 text-sm truncate">{selectedClaim.itemTitle}</p>
                <p className="text-slate-500">Item ID: {selectedClaim.itemId}</p>
                <div className="pt-1"><StatusBadge status={selectedClaim.status} size="sm" /></div>
              </div>
            </div>

            {/* Proof Explanation */}
            <div className="space-y-1.5">
              <h5 className="font-bold text-slate-900">Unique Identifying Feature Explanation:</h5>
              <p className="p-3.5 bg-blue-50/60 rounded-2xl border border-blue-200 text-blue-950 font-medium text-xs">
                "{selectedClaim.uniqueFeature}"
              </p>
            </div>

            <div className="space-y-1.5">
              <h5 className="font-bold text-slate-900">Claimant Statement:</h5>
              <p className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-slate-700">
                "{selectedClaim.reason}"
              </p>
            </div>

            {selectedClaim.proofImage && (
              <div className="space-y-1.5">
                <h5 className="font-bold text-slate-900">Submitted Proof Document / Image:</h5>
                <div className="rounded-2xl overflow-hidden border border-slate-200 max-h-56">
                  <img src={selectedClaim.proofImage} alt="Proof" className="w-full h-full object-cover" />
                </div>
              </div>
            )}

            {/* Admin Remark Input */}
            <Textarea
              label="Admin Verification Remark & Instructions"
              rows={2}
              placeholder="Enter official remark (e.g. Owner verified via student ID. Ready for pickup at Desk 104)..."
              value={adminRemark}
              onChange={(e) => setAdminRemark(e.target.value)}
            />

            {/* Decision Buttons */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
              <Button variant="outline" onClick={() => setSelectedClaim(null)} disabled={actionLoading}>
                Cancel
              </Button>
              <div className="flex items-center gap-2">
                <Button
                  variant="danger"
                  icon={XCircle}
                  loading={actionLoading}
                  onClick={() => handleUpdateStatus('Rejected')}
                >
                  Reject Claim
                </Button>
                <Button
                  variant="success"
                  icon={CheckCircle2}
                  loading={actionLoading}
                  onClick={() => handleUpdateStatus('Approved')}
                >
                  Approve Claim
                </Button>
              </div>
            </div>

          </div>
        )}
      </Modal>

    </div>
  );
};

export default AdminClaimsPage;
