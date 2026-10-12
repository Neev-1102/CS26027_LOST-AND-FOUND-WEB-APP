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
  Sparkles
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
  Line
} from 'recharts';

const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#8b5cf6', '#f43f5e', '#64748b'];

const AdminDashboardPage = () => {
  const [analytics, setAnalytics] = useState(null);
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminOverview = async () => {
      setLoading(true);
      try {
        const data = await adminService.getAnalytics('30d');
        const claimList = await claimService.getAllClaims();
        setAnalytics(data);
        setClaims(claimList.filter(c => c.status === 'Pending' || c.status === 'Under Review'));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminOverview();
  }, []);

  if (loading) return <LoadingSkeleton type="details" />;

  const stats = analytics?.overview || {
    totalUsers: 5420,
    lostItems: 1250,
    foundItems: 980,
    pendingClaims: 45,
    recoveredItems: 720,
    recoveryRate: 73.5
  };

  const lostVsFound = analytics?.lostVsFound || [
    { month: 'Mar', lost: 45, found: 38, recovered: 28 },
    { month: 'Apr', lost: 52, found: 42, recovered: 34 },
    { month: 'May', lost: 68, found: 55, recovered: 42 },
    { month: 'Jun', lost: 30, found: 25, recovered: 20 },
    { month: 'Jul', lost: 24, found: 18, recovered: 15 },
    { month: 'Aug', lost: 88, found: 74, recovered: 58 }
  ];

  const byCategory = analytics?.byCategory || [
    { name: 'Electronics', value: 42 },
    { name: 'ID Cards', value: 68 },
    { name: 'Accessories', value: 35 },
    { name: 'Books', value: 31 },
    { name: 'Bags', value: 24 },
    { name: 'Keys', value: 19 }
  ];

  const claimStats = [
    { status: 'Approved', count: 142, fill: '#10b981' },
    { status: 'Under Review', count: 28, fill: '#3b82f6' },
    { status: 'Pending', count: 18, fill: '#f59e0b' },
    { status: 'Rejected', count: 12, fill: '#ef4444' }
  ];

  return (
    <div className="space-y-8">
      
      {/* Admin Stat Cards (Section 39) */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-soft">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Total Users</p>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">{stats.totalUsers.toLocaleString()}</h3>
          <span className="text-[10px] text-emerald-600 font-semibold">+12% this term</span>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-soft">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Lost Items</p>
          <h3 className="text-xl sm:text-2xl font-black text-rose-600 mt-1">{stats.lostItems.toLocaleString()}</h3>
          <span className="text-[10px] text-slate-400">Total reported</span>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-soft">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Found Items</p>
          <h3 className="text-xl sm:text-2xl font-black text-blue-600 mt-1">{stats.foundItems.toLocaleString()}</h3>
          <span className="text-[10px] text-slate-400">In campus custody</span>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-soft">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Claims</p>
          <h3 className="text-xl sm:text-2xl font-black text-indigo-600 mt-1">{stats.pendingClaims}</h3>
          <span className="text-[10px] text-amber-600 font-semibold">Awaiting review</span>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-soft">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Returned Items</p>
          <h3 className="text-xl sm:text-2xl font-black text-emerald-600 mt-1">{stats.recoveredItems}</h3>
          <span className="text-[10px] text-emerald-600 font-semibold">{stats.recoveryRate}% rate</span>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-soft">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">AI Matches</p>
          <h3 className="text-xl sm:text-2xl font-black text-blue-600 mt-1">156</h3>
          <span className="text-[10px] text-blue-600 font-semibold">Active suggestions</span>
        </div>
      </div>

      {/* Recharts Analytics Row 1: Lost vs Found & Categories (Section 39) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Lost vs Found Chart */}
        <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-soft space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-blue-600" />
              <span>Lost vs Found Monthly Volume</span>
            </h3>
            <span className="text-xs text-slate-400">Past 6 Months</span>
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
            <span className="text-xs text-slate-400">Breakdown</span>
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
              <span>Claim Verification Statistics</span>
            </h3>
            <span className="text-xs text-slate-400">By Status</span>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={claimStats} layout="vertical" margin={{ top: 5, right: 20, left: 40, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} />
                <YAxis dataKey="status" type="category" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '11px' }} />
                <Bar dataKey="count" name="Total Claims" radius={[0, 6, 6, 0]}>
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
              <span>Monthly Platform Recovery Activity</span>
            </h3>
            <span className="text-xs text-slate-400">Success Trend</span>
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
                claims.map((claim) => (
                  <tr key={claim.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-3 font-bold text-slate-900">
                      {claim.claimant?.name} <span className="text-[10px] text-slate-400 font-normal">({claim.claimant?.studentId})</span>
                    </td>
                    <td className="p-3 font-medium text-slate-800 truncate max-w-xs">{claim.itemTitle}</td>
                    <td className="p-3 font-medium text-slate-500">{claim.claimDate}</td>
                    <td className="p-3">
                      <StatusBadge status={claim.status} size="sm" />
                    </td>
                    <td className="p-3 text-right">
                      <Link to="/admin/claims">
                        <Button variant="primary" size="sm" icon={Eye}>
                          Verify Claim
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default AdminDashboardPage;
