import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../../services/adminService';
import { claimService } from '../../services/claimService';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import Button from '../../components/common/Button';
import {
  Users,
  Package,
  FileCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Eye,
  TrendingUp,
  BarChart3,
  PieChart as PieIcon,
  Sparkles,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';
import { formatDate } from '../../utils/formatters';

const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#8b5cf6', '#f43f5e', '#64748b'];

const AdminDashboardPage = () => {
  const [analytics, setAnalytics] = useState(null);
  const [statsData, setStatsData] = useState(null);
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminOverview = async () => {
      setLoading(true);
      try {
        const [analyticsRes, claimList, statsRes] = await Promise.all([
          adminService.getAnalytics(),
          claimService.getAllClaims(),
          adminService.getStats(),
        ]);
        setAnalytics(analyticsRes);
        setStatsData(statsRes?.stats || null);
        const allClaims = Array.isArray(claimList) ? claimList : [];
        setClaims(
          allClaims.filter(
            (c) => c.status === 'pending' || c.status === 'under_review'
          )
        );
      } catch (err) {
        console.error('Failed to load admin dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminOverview();
  }, []);

  if (loading) return <LoadingSkeleton type="details" />;

  const stats = {
    totalUsers: statsData?.totalUsers ?? analytics?.overview?.totalUsers ?? 0,
    lostItems: statsData?.totalLost ?? analytics?.overview?.lostItems ?? 0,
    foundItems: statsData?.totalFound ?? analytics?.overview?.foundItems ?? 0,
    pendingClaims: statsData?.totalClaims ?? analytics?.overview?.pendingClaims ?? 0,
    recoveredItems: statsData?.returnedCount ?? analytics?.overview?.recoveredItems ?? 0,
    recoveryRate: statsData?.recoveryRate ?? analytics?.overview?.recoveryRate ?? 0,
  };

  const lostVsFound = analytics?.lostVsFound?.length > 0 ? analytics.lostVsFound : [
    { month: 'Current', lost: stats.lostItems, found: stats.foundItems, recovered: stats.recoveredItems }
  ];

  const byCategory = analytics?.byCategory?.length > 0 ? analytics.byCategory : [
    { name: 'General', value: stats.foundItems || 1 }
  ];

  const claimStatusCounts = statsData?.claimsByStatus || {};
  const claimStats = [
    { status: 'Completed', count: claimStatusCounts.completed || 0, fill: '#10b981' },
    { status: 'Approved', count: claimStatusCounts.approved || 0, fill: '#6366f1' },
    { status: 'Under Review', count: claimStatusCounts.under_review || 0, fill: '#3b82f6' },
    { status: 'Pending', count: claimStatusCounts.pending || 0, fill: '#f59e0b' },
    { status: 'Rejected', count: claimStatusCounts.rejected || 0, fill: '#ef4444' },
  ];

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold uppercase tracking-wider border border-purple-500/30">
            System Administration
          </span>
          <h1 className="text-2xl sm:text-3xl font-black mt-2">CampusFind Control Console</h1>
          <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-xl">
            Live operations oversight, security custody tracking, user authority management, and audit logs.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link to="/admin/staff">
            <Button variant="secondary" icon={ShieldCheck} className="bg-purple-600 text-white hover:bg-purple-700 border-none font-bold">
              Provision Staff Account
            </Button>
          </Link>
          <Link to="/admin/audit-logs">
            <Button variant="outline" icon={Eye} className="text-white border-white/30 hover:bg-white/10 font-bold">
              View Audit Logs
            </Button>
          </Link>
        </div>
      </div>

      {/* Admin Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-soft">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Total Users</p>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">{stats.totalUsers.toLocaleString()}</h3>
          <span className="text-[10px] text-emerald-600 font-semibold">Registered database accounts</span>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-soft">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Lost Reports</p>
          <h3 className="text-xl sm:text-2xl font-black text-rose-600 mt-1">{stats.lostItems.toLocaleString()}</h3>
          <span className="text-[10px] text-slate-400">Total submitted</span>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-soft">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Custody Items</p>
          <h3 className="text-xl sm:text-2xl font-black text-blue-600 mt-1">{stats.foundItems.toLocaleString()}</h3>
          <span className="text-[10px] text-slate-400">Total found logged</span>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-soft">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Total Claims</p>
          <h3 className="text-xl sm:text-2xl font-black text-indigo-600 mt-1">{stats.pendingClaims}</h3>
          <span className="text-[10px] text-amber-600 font-semibold">Filed by students</span>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-soft">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Returned Property</p>
          <h3 className="text-xl sm:text-2xl font-black text-emerald-600 mt-1">{stats.recoveredItems}</h3>
          <span className="text-[10px] text-emerald-600 font-semibold">{stats.recoveryRate}% recovery rate</span>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-soft">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">System State</p>
          <h3 className="text-xl sm:text-2xl font-black text-emerald-600 mt-1">Live</h3>
          <span className="text-[10px] text-blue-600 font-semibold">MongoDB Synchronized</span>
        </div>
      </div>

      {/* Recharts Analytics Row 1: Lost vs Found & Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Lost vs Found Chart */}
        <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-soft space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-blue-600" />
              <span>Campus Lost vs Found Activity</span>
            </h3>
            <span className="text-xs text-slate-400">Real-Time Database Aggregation</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={lostVsFound} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '11px' }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Bar dataKey="lost" name="Lost Items" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                <Bar dataKey="found" name="Found Items" fill="#2563eb" radius={[4, 4, 0, 0]} />
                <Bar dataKey="recovered" name="Returned Items" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Item Categories Donut */}
        <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-soft space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-indigo-600" />
              <span>Item Categories</span>
            </h3>
            <span className="text-xs text-slate-400">Distribution</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={byCategory}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {byCategory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '11px' }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '10px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recharts Analytics Row 2: Claim Statistics & Monthly Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Claim Statistics Bar */}
        <div className="lg:col-span-6 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-soft space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-emerald-600" />
              <span>Claims Breakdown by Workflow State</span>
            </h3>
            <span className="text-xs text-slate-400">Current Statuses</span>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={claimStats} layout="vertical" margin={{ top: 5, right: 20, left: 40, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} />
                <YAxis dataKey="status" type="category" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '11px' }} />
                <Bar dataKey="count" name="Claims" radius={[0, 6, 6, 0]}>
                  {claimStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly Activity Line Chart */}
        <div className="lg:col-span-6 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-soft space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              <span>Campus Recovery Trajectory</span>
            </h3>
            <span className="text-xs text-slate-400">Resolution Trend</span>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lostVsFound} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '11px' }} />
                <Line type="monotone" dataKey="recovered" name="Items Returned" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="lost" name="New Reports" stroke="#f43f5e" strokeWidth={2} strokeDasharray="4 4" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Pending Claims Verification Queue */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-soft space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            <h3 className="text-base font-bold text-slate-900">Pending Claims Verification Queue</h3>
          </div>
          <Link to="/admin/claims" className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1">
            <span>Manage All Claims</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 uppercase text-[10px] font-bold text-slate-400 tracking-wider">
              <tr>
                <th className="p-3">Claimant</th>
                <th className="p-3">Target Item</th>
                <th className="p-3">Claim Date</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {claims.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-6 text-center text-slate-400 font-medium">
                    No pending claims awaiting verification.
                  </td>
                </tr>
              ) : (
                claims.map((claim) => {
                  const claimId = claim._id || claim.id;
                  const item = claim.foundItem || {};
                  return (
                    <tr key={claimId} className="hover:bg-slate-50/70 transition-colors">
                      <td className="p-3 font-bold text-slate-900">
                        {claim.claimant?.name || 'Student'}{' '}
                        <span className="text-[10px] text-slate-400 font-normal">
                          ({claim.claimant?.collegeId || claim.claimant?.studentId || 'ID'})
                        </span>
                      </td>
                      <td className="p-3 font-medium text-slate-800 truncate max-w-xs">
                        {item.internalItemName || item.title || claim.itemTitle || 'Found Item'}
                      </td>
                      <td className="p-3 font-medium text-slate-500">
                        {formatDate(claim.createdAt || claim.claimDate)}
                      </td>
                      <td className="p-3">
                        <StatusBadge status={claim.status} size="sm" />
                      </td>
                      <td className="p-3 text-right">
                        <Link to={`/admin/claims`}>
                          <Button variant="primary" size="sm" icon={Eye}>
                            Inspect Claim
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
