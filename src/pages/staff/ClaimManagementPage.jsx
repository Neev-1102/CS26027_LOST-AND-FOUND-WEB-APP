import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { claimService } from '../../services/claimService';
import DashboardTable from '../../components/dashboard/DashboardTable';
import ClaimStatus from '../../components/claims/ClaimStatus';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Button from '../../components/common/Button';
import { FileCheck2, ArrowRight, CheckCircle2 } from 'lucide-react';
import { formatDate } from '../../utils/formatters';

const ClaimManagementPage = () => {
  const [searchParams] = useSearchParams();
  const initialStatus = searchParams.get('status') || 'all';

  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState(initialStatus);

  const fetchClaims = async () => {
    try {
      setLoading(true);
      const res = await claimService.getStaffClaims({ status: statusFilter });
      setClaims(res.claims || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClaims();
  }, [statusFilter]);

  const columns = [
    {
      header: 'Claim Ref',
      accessor: '_id',
      render: (row) => (
        <span className="font-mono text-xs font-bold text-slate-700">
          #{row._id?.toString().slice(-6) || row.id}
        </span>
      ),
    },
    {
      header: 'Claimed Property',
      accessor: 'foundItem',
      render: (row) => {
        const item = row.foundItem || {};
        return (
          <div>
            <span className="font-bold text-slate-900 block">{item.internalItemName || item.title || 'Found Item'}</span>
            <span className="text-slate-400 text-[11px]">{item.category}</span>
          </div>
        );
      },
    },
    {
      header: 'Claimant Student',
      accessor: 'claimant',
      render: (row) => {
        const student = row.claimant || {};
        return (
          <div>
            <span className="font-bold text-slate-800 block text-xs">{student.name || 'Campus Student'}</span>
            <span className="text-slate-500 text-[11px]">{student.department || student.collegeId}</span>
          </div>
        );
      },
    },
    {
      header: 'Date Filed',
      accessor: 'createdAt',
      render: (row) => formatDate(row.createdAt),
    },
    {
      header: 'Verification Status',
      accessor: 'status',
      render: (row) => <ClaimStatus status={row.status} />,
    },
    {
      header: 'Action',
      render: (row) => {
        const claimId = row._id || row.id;
        if (row.status === 'approved') {
          return (
            <Link
              to={`/staff/claims/${claimId}/handover`}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors"
            >
              <CheckCircle2 className="w-3.5 h-3.5" /> Confirm Handover
            </Link>
          );
        }
        return (
          <Link
            to={`/staff/claims/${claimId}`}
            className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
          >
            Review Evidence <ArrowRight className="w-3 h-3" />
          </Link>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Claim Verification & Handovers</h1>
          <p className="text-xs text-slate-500">
            Verify ownership evidence submitted by students and record official physical returns.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {['all', 'pending', 'under_review', 'additional_information_requested', 'approved', 'completed', 'rejected'].map(
          (st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${
                statusFilter === st
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {st.replace(/_/g, ' ')}
            </button>
          )
        )}
      </div>

      {loading ? (
        <LoadingSpinner message="Loading claim records..." />
      ) : (
        <DashboardTable
          columns={columns}
          data={claims}
          emptyMessage="No claims found under this filter."
        />
      )}
    </div>
  );
};

export default ClaimManagementPage;
