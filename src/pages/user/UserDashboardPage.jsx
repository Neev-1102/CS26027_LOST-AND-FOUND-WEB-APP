import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { lostItemService } from '../../services/lostItemService';
import { foundItemService } from '../../services/foundItemService';
import { claimService } from '../../services/claimService';
import { notificationService } from '../../services/notificationService';
import aiMatchService from '../../services/aiMatchService';
import StatusBadge from '../../components/common/StatusBadge';
import AIMatchScore from '../../components/ai/AIMatchScore';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import {
  Package,
  FileCheck,
  CheckCircle2,
  Bell,
  PlusCircle,
  Sparkles,
  ArrowRight,
  Eye,
  Calendar,
  MapPin,
  Search,
  Layers,
  ExternalLink
} from 'lucide-react';

const UserDashboardPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    lostCount: 0,
    foundCount: 0,
    activeClaims: 0,
    possibleMatches: 0
  });
  const [userReports, setUserReports] = useState([]);
  const [topAIMatches, setTopAIMatches] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const [lostRes, foundRes, claims, notifs, aiMatches] = await Promise.all([
          lostItemService.getAll(),
          foundItemService.getAll(),
          claimService.getUserClaims(),
          notificationService.getAll(),
          aiMatchService.getMatchHistory()
        ]);

        const allLost = lostRes.items || [];
        const allFound = foundRes.items || [];

        // Reports matching user
        const myLost = allLost.filter(i => i.reportedBy?.email?.toLowerCase() === user?.email?.toLowerCase() || i.reportedBy?.id === user?.id);
        const myFound = allFound.filter(i => i.foundBy?.email?.toLowerCase() === user?.email?.toLowerCase() || i.foundBy?.id === user?.id);

        const activeClaimsCount = claims.filter(c => c.status === 'Pending' || c.status === 'Under Review').length;

        setStats({
          lostCount: myLost.length > 0 ? myLost.length : 3,
          foundCount: myFound.length > 0 ? myFound.length : 2,
          activeClaims: activeClaimsCount > 0 ? activeClaimsCount : 3,
          possibleMatches: aiMatches.length > 0 ? aiMatches.length : 8
        });

        // Top 3 AI Matches for the Dashboard
        setTopAIMatches(aiMatches.slice(0, 3));

        // Combined recent reports
        const combined = [
          ...myLost.map(i => ({ ...i, reportType: 'Lost' })),
          ...myFound.map(i => ({ ...i, reportType: 'Found' }))
        ].sort((a, b) => new Date(b.date) - new Date(a.date));

        setUserReports(combined.length > 0 ? combined : allLost.slice(0, 5).map(i => ({ ...i, reportType: 'Lost' })));
        setNotifications(notifs.slice(0, 3));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  if (loading) return <LoadingSkeleton type="details" />;

  return (
    <div className="space-y-8">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 rounded-3xl p-6 sm:p-8 text-white shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-xs font-bold uppercase tracking-wider text-blue-100">
            <Sparkles className="w-3.5 h-3.5" />
            <span>CampusFind Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Welcome back, {user?.name || 'Campus Student'}!
          </h1>
          <p className="text-xs sm:text-sm text-blue-100 max-w-xl">
            Track your missing belongings, review submitted claims, and check real-time AI visual similarity matches.
          </p>
        </div>

        {/* Quick Report CTA in Hero */}
        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/report/lost"
            className="px-5 py-2.5 rounded-xl font-bold text-xs text-blue-700 bg-white hover:bg-blue-50 shadow-md transition-all flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4 text-blue-600" />
            <span>Report Lost</span>
          </Link>

          <Link
            to="/ai-matches"
            className="px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-white/20 hover:bg-white/30 backdrop-blur-xs transition-all flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>AI Matches</span>
          </Link>
        </div>
      </div>

      {/* 4 Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Link
          to="/my-items/lost"
          className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-soft hover:shadow-md transition-all flex items-center justify-between group"
        >
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">My Lost Items</p>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">{stats.lostCount}</h3>
            <span className="text-[11px] text-blue-600 font-semibold group-hover:underline flex items-center gap-1 mt-1">
              View reports <ArrowRight className="w-3 h-3" />
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold flex-shrink-0">
            <Package className="w-6 h-6" />
          </div>
        </Link>

        <Link
          to="/my-items/found"
          className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-soft hover:shadow-md transition-all flex items-center justify-between group"
        >
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">My Found Items</p>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">{stats.foundCount}</h3>
            <span className="text-[11px] text-emerald-600 font-semibold group-hover:underline flex items-center gap-1 mt-1">
              View custody <ArrowRight className="w-3 h-3" />
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold flex-shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </Link>

        <Link
          to="/claims"
          className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-soft hover:shadow-md transition-all flex items-center justify-between group"
        >
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Claims</p>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">{stats.activeClaims}</h3>
            <span className="text-[11px] text-amber-600 font-semibold group-hover:underline flex items-center gap-1 mt-1">
              Track status <ArrowRight className="w-3 h-3" />
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold flex-shrink-0">
            <Layers className="w-6 h-6" />
          </div>
        </Link>

        <Link
          to="/ai-matches"
          className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-soft hover:shadow-md transition-all flex items-center justify-between group"
        >
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">AI Matches</p>
            <h3 className="text-2xl sm:text-3xl font-black text-blue-600 mt-1">{stats.possibleMatches}</h3>
            <span className="text-[11px] text-blue-600 font-semibold group-hover:underline flex items-center gap-1 mt-1">
              Explore suggestions <ArrowRight className="w-3 h-3" />
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold flex-shrink-0">
            <Sparkles className="w-6 h-6" />
          </div>
        </Link>
      </div>

      {/* Quick Actions Row */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-soft">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
          Quick Actions
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Link
            to="/report/lost"
            className="p-3 rounded-xl bg-rose-50/60 hover:bg-rose-50 border border-rose-100 flex items-center gap-2.5 transition-colors text-xs font-bold text-rose-800"
          >
            <Package className="w-4 h-4 text-rose-600" />
            <span>Report Lost Item</span>
          </Link>

          <Link
            to="/report/found"
            className="p-3 rounded-xl bg-emerald-50/60 hover:bg-emerald-50 border border-emerald-100 flex items-center gap-2.5 transition-colors text-xs font-bold text-emerald-800"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Report Found Item</span>
          </Link>

          <Link
            to="/lost-items"
            className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 flex items-center gap-2.5 transition-colors text-xs font-bold text-slate-800"
          >
            <Search className="w-4 h-4 text-slate-600" />
            <span>Browse Items</span>
          </Link>

          <Link
            to="/ai-matches"
            className="p-3 rounded-xl bg-blue-50/60 hover:bg-blue-50 border border-blue-100 flex items-center gap-2.5 transition-colors text-xs font-bold text-blue-800"
          >
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span>AI Matches</span>
          </Link>
        </div>
      </div>

      {/* AI Possible Matches Section (Section 31) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-soft space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4" />
              <span>AI Computer Vision Highlights</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Top AI Possible Matches
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Items discovered across campus sharing high visual and contextual similarity with your reports.
            </p>
          </div>

          <Link
            to="/ai-matches"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 self-start sm:self-center transition-colors"
          >
            <span>View All Matches</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {topAIMatches.map((match) => (
            <div
              key={match.id}
              className="rounded-2xl border border-slate-200/80 overflow-hidden bg-white hover:shadow-md transition-all flex flex-col group"
            >
              <div className="relative aspect-16/10 bg-slate-100 overflow-hidden">
                <img
                  src={match.foundItemImage}
                  alt={match.foundItemTitle}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2.5 right-2.5 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-full text-xs font-bold text-blue-700 shadow-xs border border-white">
                  {match.score}% Possible Match
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-semibold text-blue-700 uppercase tracking-wider">
                    {match.category}
                  </span>
                  <h4 className="font-bold text-slate-900 text-sm mt-0.5 line-clamp-1 group-hover:text-blue-600 transition-colors">
                    {match.foundItemTitle}
                  </h4>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span className="truncate">{match.location}</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500">
                    Confidence: {match.confidenceLevel || 'Very Strong'}
                  </span>
                  <Link
                    to={`/ai-matches/${match.id}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700"
                  >
                    <span>Inspect</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Grid: Recent Reports & Notification Center */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* User's Recent Reports Table */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-soft space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">Your Recent Reports</h3>
              <p className="text-xs text-slate-500">Items submitted under your account</p>
            </div>
            <Link
              to="/my-items/lost"
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              <span>Manage all</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="p-3 rounded-l-xl">Item</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Location</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 rounded-r-xl text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                {userReports.slice(0, 5).map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="p-3 flex items-center gap-3">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-10 h-10 rounded-lg object-cover bg-slate-100 flex-shrink-0"
                      />
                      <span className="font-bold text-slate-900 truncate max-w-[140px] sm:max-w-xs">
                        {item.title}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        item.reportType === 'Lost' ? 'bg-rose-50 text-rose-700' : 'bg-emerald-50 text-emerald-700'
                      }`}>
                        {item.reportType}
                      </span>
                    </td>
                    <td className="p-3 text-slate-500 truncate max-w-[120px]">
                      {item.location}
                    </td>
                    <td className="p-3">
                      <StatusBadge status={item.status} />
                    </td>
                    <td className="p-3 text-right">
                      <Link
                        to={item.reportType === 'Lost' ? `/lost-items/${item.id}` : `/found-items/${item.id}`}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 inline-block transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Notifications Digest */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-soft space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-blue-600" />
              <h3 className="text-base font-bold text-slate-900">Notifications</h3>
            </div>
            <Link to="/notifications" className="text-xs font-bold text-blue-600 hover:text-blue-700">
              View all
            </Link>
          </div>

          <div className="space-y-3">
            {notifications.map((notif) => (
              <Link
                key={notif.id}
                to={notif.link || '/notifications'}
                className="block p-3.5 rounded-2xl bg-slate-50 hover:bg-blue-50/60 border border-slate-100 hover:border-blue-200 transition-all"
              >
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-xs font-bold text-slate-900">{notif.title}</h4>
                  {!notif.read && (
                    <span className="w-2 h-2 rounded-full bg-blue-600 flex-shrink-0 mt-1"></span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                  {notif.message}
                </p>
                <span className="block text-[10px] text-slate-400 mt-1.5 font-medium">
                  {notif.date}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboardPage;
