import React, { useState, useEffect } from 'react';
import { claimService } from '../../services/claimService';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import EmptyState from '../../components/common/EmptyState';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import { FileCheck, ShieldAlert, Calendar, Info, Eye } from 'lucide-react';

const MyClaimsPage = () => {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedClaim, setSelectedClaim] = useState(null);

  useEffect(() => {
    const fetchClaims = async () => {
      setLoading(true);
      try {
        const data = await claimService.getUserClaims();
        setClaims(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchClaims();
  }, []);

  if (loading) return <LoadingSkeleton type="details" />;

  return (
    <div className="space-y-6">
      
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-soft">
        <h1 className="text-2xl font-black text-slate-900">My Ownership Claims</h1>
        <p className="text-xs text-slate-500 mt-1">
          Track the verification status of claims you submitted for found belongings on campus.
        </p>
      </div>

      {claims.length === 0 ? (
        <EmptyState
          icon={FileCheck}
          title="No claims submitted yet"
          description="When you identify your item in the Found Items directory, click 'This Is My Item' to submit a claim."
          actionText="Explore Found Items"
          onAction={() => window.location.href = '/found-items'}
        />
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-soft">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                <tr>
                  <th className="p-4">Item Details</th>
                  <th className="p-4">Claim Date</th>
                  <th className="p-4">Verification Status</th>
                  <th className="p-4">Admin Remark</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {claims.map((claim) => (
                  <tr key={claim.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-4 font-bold text-slate-900 flex items-center gap-3">
                      <img
                        src={claim.itemImage}
                        alt={claim.itemTitle}
                        className="w-10 h-10 rounded-xl object-cover border border-slate-100 shrink-0"
                      />
                      <span className="truncate max-w-xs">{claim.itemTitle}</span>
                    </td>
                    <td className="p-4 font-medium text-slate-500">{claim.claimDate}</td>
                    <td className="p-4">
                      <StatusBadge status={claim.status} />
                    </td>
                    <td className="p-4 font-medium text-slate-600 max-w-xs truncate">
                      {claim.adminRemark || 'Under review by Campus Security Desk 104.'}
                    </td>
                    <td className="p-4 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={Eye}
                        onClick={() => setSelectedClaim(claim)}
                      >
                        Inspect Proof
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Claim Detail Inspector Modal */}
      <Modal
        isOpen={!!selectedClaim}
        onClose={() => setSelectedClaim(null)}
        title="Ownership Claim Details"
        subtitle={`Claim ID: ${selectedClaim?.id}`}
      >
        {selectedClaim && (
          <div className="space-y-4 text-xs">
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200">
              <img src={selectedClaim.itemImage} alt="" className="w-12 h-12 rounded-xl object-cover" />
              <div>
                <h4 className="font-bold text-slate-900">{selectedClaim.itemTitle}</h4>
                <div className="mt-1"><StatusBadge status={selectedClaim.status} size="sm" /></div>
              </div>
            </div>

            <div className="space-y-2">
              <h5 className="font-bold text-slate-800">Submitted Unique Identifying Feature:</h5>
              <p className="p-3 bg-slate-50 rounded-xl text-slate-700 border border-slate-200 font-medium">
                {selectedClaim.uniqueFeature}
              </p>
            </div>

            <div className="space-y-2">
              <h5 className="font-bold text-slate-800">Reason for Ownership:</h5>
              <p className="p-3 bg-slate-50 rounded-xl text-slate-600 border border-slate-200">
                {selectedClaim.reason}
              </p>
            </div>

            {selectedClaim.proofImage && (
              <div className="space-y-2">
                <h5 className="font-bold text-slate-800">Uploaded Ownership Proof:</h5>
                <img
                  src={selectedClaim.proofImage}
                  alt="Proof"
                  className="w-full h-44 rounded-xl object-cover border border-slate-200"
                />
              </div>
            )}

            <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-900">
              <p className="font-bold flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-blue-600" /> Admin Remark:
              </p>
              <p className="mt-1 text-blue-800">
                {selectedClaim.adminRemark}
              </p>
            </div>

            <div className="pt-3 flex justify-end">
              <Button variant="outline" size="sm" onClick={() => setSelectedClaim(null)}>
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>

    </div>
  );
};

export default MyClaimsPage;
