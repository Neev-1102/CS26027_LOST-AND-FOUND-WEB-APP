import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import StatusBadge from '../../components/common/StatusBadge';
import Button from '../../components/common/Button';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import {
  Building2,
  PackagePlus,
  CheckSquare,
  Award,
  BookOpen,
  UserCheck,
  MapPin,
  Clock,
  QrCode,
  FileSpreadsheet,
  FileCheck2,
  ShieldCheck,
  Search,
  Filter
} from 'lucide-react';

const FacultyDashboardPage = () => {
  const { user } = useAuth();
  const { showSuccess, showError } = useToast();
  const [loading, setLoading] = useState(true);

  // Faculty specific states
  const [departmentItems, setDepartmentItems] = useState([
    {
      id: 'rpt_fac_1',
      title: 'TI-84 Plus CE Graphing Calculator',
      category: 'Electronics',
      location: 'Engineering Hall - Aud B',
      date: '2026-08-15',
      status: 'pending',
      claimedByStudent: 'Alex Johnson (STU-9042)',
      claimReason: 'Left after EE201 exam on third row desk. Has my initials written on back.',
      holdingStation: 'EE Faculty Office 204'
    },
    {
      id: 'rpt_fac_2',
      title: 'Stainless Steel Water Flask',
      category: 'Personal Belongings',
      location: 'Computer Lab 304',
      date: '2026-08-14',
      status: 'approved',
      claimedByStudent: 'Maria Garcia (STU-8812)',
      claimReason: 'Matching sticker of Campus Robotics Club.',
      holdingStation: 'CS Reception Desk'
    },
    {
      id: 'rpt_fac_3',
      title: 'Logitech Wireless Presenter Remote',
      category: 'Electronics',
      location: 'Science Building - Aud A',
      date: '2026-08-12',
      status: 'pending',
      claimedByStudent: 'David Kim (STU-7721)',
      claimReason: 'Forgotten after Senior Project presentation.',
      holdingStation: 'Dean Office Holding Locker #4'
    }
  ]);

  const [newTurnIn, setNewTurnIn] = useState({
    title: '',
    category: 'Electronics',
    location: '',
    description: '',
    holdingStation: 'EE Faculty Office 204'
  });

  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Simulate loading data from MongoDB
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const handleApproveClaim = (itemId) => {
    setDepartmentItems(prev =>
      prev.map(item =>
        item.id === itemId ? { ...item, status: 'approved' } : item
      )
    );
    showSuccess('Claim ownership verified! Release pass issued to student.');
  };

  const handleCreateTurnIn = (e) => {
    e.preventDefault();
    if (!newTurnIn.title || !newTurnIn.location) {
      showError('Please provide item name and location where found.');
      return;
    }

    const newItem = {
      id: 'rpt_fac_' + Date.now(),
      title: newTurnIn.title,
      category: newTurnIn.category,
      location: newTurnIn.location,
      date: new Date().toISOString().split('T')[0],
      status: 'pending',
      claimedByStudent: 'None yet',
      claimReason: 'Awaiting student inquiry',
      holdingStation: newTurnIn.holdingStation
    };

    setDepartmentItems([newItem, ...departmentItems]);
    setShowModal(false);
    setNewTurnIn({
      title: '',
      category: 'Electronics',
      location: '',
      description: '',
      holdingStation: 'EE Faculty Office 204'
    });
    showSuccess('Classroom found item logged in department registry!');
  };

  if (loading) return <LoadingSkeleton type="table" />;

  return (
    <div className="space-y-8">
      
      {/* Faculty Hero Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden border border-emerald-700/40">
        <div className="space-y-2 z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold uppercase tracking-wider">
            <Building2 className="w-4 h-4" /> Faculty & Staff Operations Portal
          </div>
          <h1 className="text-3xl font-black tracking-tight text-white">
            Welcome, {user?.name || 'Prof. Sarah Jenkins'}!
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100 max-w-xl">
            Department: <span className="font-bold text-white">{user?.department || 'Department of Electrical Engineering'}</span> • Staff ID: <span className="font-mono text-emerald-200">{user?.employeeId || 'FAC-8041'}</span>
          </p>
        </div>

        <div className="flex flex-wrap gap-3 z-10">
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg transition-all"
          >
            <PackagePlus className="w-4 h-4" />
            <span>Turn In Classroom Found Item</span>
          </button>
        </div>

        <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-soft flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold shrink-0">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400">Classroom Logs</p>
            <h3 className="text-2xl font-black text-slate-900">{departmentItems.length}</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-soft flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold shrink-0">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400">Pending Student Claims</p>
            <h3 className="text-2xl font-black text-slate-900">
              {departmentItems.filter(i => i.status === 'pending').length}
            </h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-soft flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold shrink-0">
            <FileCheck2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400">Approved Passes</p>
            <h3 className="text-2xl font-black text-slate-900">
              {departmentItems.filter(i => i.status === 'approved').length}
            </h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-soft flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400">Holding Stations</p>
            <h3 className="text-2xl font-black text-slate-900">3 Lockers</h3>
          </div>
        </div>

      </div>

      {/* Main Department Claims & Verification Queue */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-soft space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-emerald-600" />
              Student Claim Verification Queue
            </h3>
            <p className="text-xs text-slate-500">
              Verify student ownership details and issue campus pickup authorization passes.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200">
              Department Holding Registry
            </span>
          </div>
        </div>

        <div className="space-y-4">
          {departmentItems.map((item) => (
            <div
              key={item.id}
              className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 hover:border-emerald-300 transition-all space-y-4"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-slate-200 text-slate-700">
                      {item.category}
                    </span>
                    <StatusBadge status={item.status} size="sm" />
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Logged on {item.date}
                    </span>
                  </div>
                  <h4 className="text-base font-extrabold text-slate-900">{item.title}</h4>
                  <p className="text-xs text-slate-600 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    Found Location: <span className="font-semibold text-slate-800">{item.location}</span>
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  {item.status === 'pending' ? (
                    <button
                      onClick={() => handleApproveClaim(item.id)}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md flex items-center gap-1.5 transition-all"
                    >
                      <UserCheck className="w-4 h-4" />
                      <span>Verify & Release Pass</span>
                    </button>
                  ) : (
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-bold">
                      <QrCode className="w-4 h-4" />
                      <span>Pass Issued: PASS-{item.id.slice(-4).toUpperCase()}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Student Claim Details Box */}
              <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800">
                    Claimant Student: <span className="text-blue-600">{item.claimedByStudent}</span>
                  </span>
                  <span className="text-[11px] text-slate-500 font-medium">
                    Locker Station: <span className="font-bold text-slate-700">{item.holdingStation}</span>
                  </span>
                </div>
                <p className="text-slate-600 italic">
                  "Proof Statement: {item.claimReason}"
                </p>
              </div>

            </div>
          ))}
        </div>
      </div>

      {/* Classroom Turn-In Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                <PackagePlus className="w-5 h-5 text-emerald-600" />
                Turn In Classroom Found Item
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-700 font-bold text-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTurnIn} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Item Title / Description</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Blue USB Flash Drive or Glasses Case"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
                  value={newTurnIn.title}
                  onChange={(e) => setNewTurnIn({ ...newTurnIn, title: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Category</label>
                  <select
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
                    value={newTurnIn.category}
                    onChange={(e) => setNewTurnIn({ ...newTurnIn, category: e.target.value })}
                  >
                    <option value="Electronics">Electronics</option>
                    <option value="Books & Notes">Books & Notes</option>
                    <option value="Personal Belongings">Personal Belongings</option>
                    <option value="Keys & ID Cards">Keys & ID Cards</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Found Classroom / Lab</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. EE Lab 202"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
                    value={newTurnIn.location}
                    onChange={(e) => setNewTurnIn({ ...newTurnIn, location: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Department Holding Station</label>
                <input
                  type="text"
                  placeholder="e.g. Faculty Office Desk Locker #2"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
                  value={newTurnIn.holdingStation}
                  onChange={(e) => setNewTurnIn({ ...newTurnIn, holdingStation: e.target.value })}
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-600 font-bold text-xs hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-lg"
                >
                  Log Item in Registry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default FacultyDashboardPage;
