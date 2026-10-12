import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { foundItemService } from '../../services/foundItemService';
import { lostItemService } from '../../services/lostItemService';
import { claimService } from '../../services/claimService';
import StatCard from '../../components/dashboard/StatCard';
import DashboardTable from '../../components/dashboard/DashboardTable';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Button from '../../components/common/Button';
import {
  PackageCheck,
  ClipboardList,
  FileCheck2,
  CheckCircle2,
  PlusCircle,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import { formatDate } from '../../utils/formatters';

const StaffDashboardPage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [foundItems, setFoundItems] = useState([]);
  const [lostItems, setLostItems] = useState([]);
  const [claims, setClaims] = useState([]);

  useEffect(() => {
    const fetchStaffData = async () => {
      try {
        setLoading(true);
        const [foundRes, lostRes, claimRes] = await Promise.all([
          foundItemService.getAll(),
          lostItemService.getAll(),
          claimService.getStaffClaims(),
        ]);

        setFoundItems(foundRes.items || []);
        setLostItems(lostRes.items || []);
        setClaims(claimRes.claims || []);
      } catch (err) {
        console.error('Failed to load staff dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStaffData();
  }, []);

  if (loading) {
    return <LoadingSpinner size="lg" message="Loading Staff Operations Console..." />;
  }

  const inCustodyCount = foundItems.filter((i) => i.status === 'in_custody' || i.status === 'claim_pending').length;
  const pendingLostReviews = lostItems.filter((i) => i.status === 'pending_review').length;
  const pendingClaims = claims.filter((c) => c.status === 'pending' || c.status === 'under_review').length;
  const readyForHandover = claims.filter((c) => c.status === 'approved').length;

  const custodyColumns = [
    {
      header: 'Item Name',
      accessor: 'internalItemName',
      render: (row) => (
        <div>
          <span className="font-bold text-slate-900 block">{row.internalItemName || row.title}</span>
          <span className="text-slate-400 text-[11px]">{row.category}</span>
        </div>
      ),
    },
    {
      header: 'Storage Location (Confidential)',
      accessor: 'storageLocation',
      render: (row) => (
        <span className="font-mono bg-slate-100 text-slate-800 px-2 py-0.5 rounded text-[11px]">
          {row.storageLocation || 'Security Desk'}
        </span>
      ),
    },
    {
      header: 'Date Found',
      accessor: 'dateFound',
      render: (row) => formatDate(row.dateFound || row.date),
    },
    {
      header: 'Custody Status',
      accessor: 'status',
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      header: 'Action',
      render: (row) => (
        <Link
          to={`/staff/found-inventory`}
          className="text-xs font-bold text-blue-600 hover:underline"
        >
          View Details
        </Link>
      ),
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider">
              Staff Operations Console
            </span>
            <span className="text-xs text-slate-400 font-medium">Campus Desk Duty</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black mt-2">Welcome, {user?.name}!</h1>
          <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-xl">
            Manage custody inventory, review student lost reports, verify ownership claims, and confirm safe physical handovers.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link to="/staff/register-found">
            <Button variant="primary" icon={PlusCircle} className="font-bold bg-blue-600 hover:bg-blue-500">
              Register Found Item
            </Button>
          </Link>
          <Link to="/staff/claims">
            <Button variant="secondary" icon={FileCheck2} className="font-bold">
              Review Claims ({pendingClaims})
            </Button>
          </Link>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="In Custody"
          value={inCustodyCount}
          icon={PackageCheck}
          color="blue"
          subtitle="Found items held in lockers"
        />
        <StatCard
          title="Pending Lost Reports"
          value={pendingLostReviews}
          icon={ClipboardList}
          color="amber"
          subtitle="Reports needing approval"
        />
        <StatCard
          title="Claims Under Review"
          value={pendingClaims}
          icon={FileCheck2}
          color="purple"
          subtitle="Student ownership claims"
        />
        <StatCard
          title="Ready For Handover"
          value={readyForHandover}
          icon={CheckCircle2}
          color="emerald"
          subtitle="Approved, awaiting collection"
        />
      </div>

      {/* Claims Ready for Handover Alert */}
      {readyForHandover > 0 && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-100 text-emerald-700 rounded-xl">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-emerald-900">
                {readyForHandover} Item(s) Approved and Ready for Handover
              </h4>
              <p className="text-xs text-emerald-700">
                Claimants have been authorized. Confirm physical handover when they present their college ID at the desk.
              </p>
            </div>
          </div>
          <Link to="/staff/claims?status=approved">
            <Button variant="primary" size="sm" className="bg-emerald-600 hover:bg-emerald-700">
              Process Handovers
            </Button>
          </Link>
        </div>
      )}

      {/* Current Custody Inventory Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Active Custody Inventory</h2>
            <p className="text-xs text-slate-500">Items held in campus secure lockers and storage cabinets</p>
          </div>
          <Link to="/staff/found-inventory" className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1">
            <span>Full Inventory ({foundItems.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <DashboardTable
          columns={custodyColumns}
          data={foundItems.slice(0, 5)}
          emptyMessage="No items in custody."
        />
      </div>
    </div>
  );
};

export default StaffDashboardPage;
