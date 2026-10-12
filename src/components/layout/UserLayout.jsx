import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Navbar from './Navbar';
import Footer from './Footer';
import {
  LayoutDashboard,
  PlusCircle,
  Package,
  FileCheck,
  Bell,
  User,
  LogOut,
  ChevronRight,
  Menu,
  X,
  Sparkles
} from 'lucide-react';

const UserLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const sidebarLinks = [
    { name: 'Student Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Report Lost Item', path: '/report/lost', icon: PlusCircle },
    { name: 'Report Found Item', path: '/report/found', icon: PlusCircle },
    { name: 'AI Matches', path: '/ai-matches', icon: Sparkles },
    { name: 'My Lost Items', path: '/my-items/lost', icon: Package },
    { name: 'My Found Items', path: '/my-items/found', icon: Package },
    { name: 'My Claims', path: '/claims', icon: FileCheck },
    { name: 'Notifications', path: '/notifications', icon: Bell, badge: true },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Mobile Sidebar Toggle */}
          <div className="lg:hidden col-span-1 mb-2">
            <button
              onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
              className="w-full flex items-center justify-between p-3.5 bg-white border border-slate-200 rounded-2xl shadow-sm text-slate-800 font-bold text-sm"
            >
              <span className="flex items-center gap-2">
                <LayoutDashboard className="w-4 h-4 text-blue-600" /> User Portal Navigation
              </span>
              {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          {/* User Sidebar */}
          <aside className={`lg:col-span-3 ${mobileSidebarOpen ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-soft sticky top-28 space-y-6">
              
              {/* User Profile Summary */}
              <div className="flex items-center gap-3.5 pb-5 border-b border-slate-100">
                <img
                  src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300'}
                  alt={user?.name}
                  className="w-12 h-12 rounded-2xl object-cover ring-2 ring-blue-500/20"
                />
                <div className="min-w-0">
                  <h4 className="font-bold text-slate-900 text-sm truncate">{user?.name}</h4>
                  <p className="text-xs text-slate-400 truncate">{user?.studentId || 'Campus User'}</p>
                  <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-bold rounded-md bg-blue-50 text-blue-600 capitalize">
                    {user?.role || 'student'}
                  </span>
                </div>
              </div>

              {/* Sidebar Links */}
              <nav className="space-y-1">
                {sidebarLinks.map((link) => {
                  const Icon = link.icon;
                  const active = isActive(link.path);
                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setMobileSidebarOpen(false)}
                      className={`flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${
                        active
                          ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`w-4 h-4 ${active ? 'text-white' : 'text-slate-400'}`} />
                        <span>{link.name}</span>
                      </div>
                      <ChevronRight className={`w-4 h-4 opacity-50 ${active ? 'text-white' : 'text-slate-400'}`} />
                    </Link>
                  );
                })}

                <button
                  onClick={() => {
                    logout();
                    navigate('/login');
                  }}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-semibold text-rose-600 hover:bg-rose-50 transition-colors mt-4"
                >
                  <div className="flex items-center gap-3">
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </div>
                </button>
              </nav>

            </div>
          </aside>

          {/* Main Portal Content */}
          <main className="lg:col-span-9">
            <Outlet />
          </main>

        </div>
      </div>

      <Footer />
    </div>
  );
};

export default UserLayout;
