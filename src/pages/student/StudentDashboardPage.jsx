import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { lostItemService } from '../../services/lostItemService';
import { claimService } from '../../services/claimService';
import { notificationService } from '../../services/notificationService';
import StatCard from '../../components/dashboard/StatCard';
import ItemCard from '../../components/items/ItemCard';
import ClaimCard from '../../components/claims/ClaimCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Button from '../../components/common/Button';
import {
  Package,
  FileCheck,
  Bell,
  PlusCircle,
  Search,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

const StudentDashboardPage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [myLostItems, setMyLostItems] = useState([]);
  const [myClaims, setMyClaims] = useState([]);
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [lostRes, claimRes, notifRes] = await Promise.all([
          lostItemService.getMyLostItems(),
          claimService.getMyClaims(),
          notificationService.getAll(),
        ]);

        setMyLostItems(lostRes.items || []);
        setMyClaims(claimRes.claims || []);
        setUnreadNotifications(notifRes.unreadCount || 0);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <LoadingSpinner size="lg" message="Loading Student Portal..." />;
  }

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 rounded-3xl p-6 sm:p-8 text-white shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <span className="px-3 py-1 rounded-full bg-white/20 text-xs font-bold uppercase tracking-wider backdrop-blur-xs">
            Student Portal
          </span>
          <h1 className="text-2xl sm:text-3xl font-black mt-2">Welcome back, {user?.name}!</h1>
          <p className="text-blue-100 text-xs sm:text-sm mt-1 max-w-xl">
            Track your lost property reports, explore items currently in campus custody, and file verified ownership claims.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link to="/student/report-lost">
            <Button variant="secondary" icon={PlusCircle} className="bg-white text-blue-600 hover:bg-blue-50 border-none font-bold">
              Report Lost Item
            </Button>
          </Link>
          <Link to="/student/available-claims">
            <Button variant="outline" icon={Search} className="text-white border-white/40 hover:bg-white/10 font-bold">
              Browse Found Items
            </Button>
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <StatCard
          title="My Lost Reports"
          value={myLostItems.length}
          icon={Package}
          color="blue"
          subtitle="Reported by you"
        />
        <StatCard
          title="My Claims"
          value={myClaims.length}
          icon={FileCheck}
          color="purple"
          subtitle="Active & completed"
        />
        <StatCard
          title="Unread Alerts"
          value={unreadNotifications}
          icon={Bell}
          color="amber"
          subtitle="System & match alerts"
        />
      </div>

      {/* Recent Lost Reports */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Your Recent Lost Reports</h2>
            <p className="text-xs text-slate-500">Items you logged that are pending review or published</p>
          </div>
          <Link to="/student/my-lost-items" className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1">
            <span>View All ({myLostItems.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {myLostItems.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
            <Package className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-700">No lost item reports yet</p>
            <p className="text-xs text-slate-400 mt-1 mb-4">Misplaced something on campus? File a report to alert campus security.</p>
            <Link to="/student/report-lost">
              <Button variant="primary" size="sm" icon={PlusCircle}>
                Report Lost Item
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {myLostItems.slice(0, 3).map((item) => (
              <ItemCard key={item._id || item.id} item={item} type="lost" />
            ))}
          </div>
        )}
      </div>

      {/* Recent Claims */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">My Ownership Claims</h2>
            <p className="text-xs text-slate-500">Track verification status by campus desk staff</p>
          </div>
          <Link to="/student/my-claims" className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1">
            <span>View All ({myClaims.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {myClaims.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
            <FileCheck className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-700">No active ownership claims</p>
            <p className="text-xs text-slate-400 mt-1 mb-4">Did you find an item in custody that belongs to you? Submit a claim with proof.</p>
            <Link to="/student/available-claims">
              <Button variant="secondary" size="sm" icon={Search}>
                Browse Found Inventory
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {myClaims.slice(0, 3).map((claim) => (
              <ClaimCard key={claim._id || claim.id} claim={claim} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboardPage;
