import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Navbar from './Navbar';
import Footer from './Footer';
import {
  Building2,
  PackagePlus,
  CheckSquare,
  FileCheck2,
  Bell,
  User,
  LogOut,
  ChevronRight,
  Menu,
  X,
  ShieldCheck
} from 'lucide-react';

const FacultyLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const sidebarLinks = [
    { name: 'Faculty Portal', path: '/faculty', icon: Building2 },
    { name: 'Notifications', path: '/notifications', icon: Bell },
    { name: 'My Profile', path: '/profile', icon: User },
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
              className="w-full flex items-center justify-between p-3.5 bg-white border border-emerald-200 rounded-2xl shadow-sm text-slate-800 font-bold text-sm"
            >
              <span className="flex items-center gap-2 text-emerald-700">
                <Building2 className="w-4 h-4 text-emerald-600" /> Faculty Operations Menu
              </span>
              {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          {/* Faculty Sidebar */}
          <aside className={`lg:col-span-3 ${mobileSidebarOpen ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-3xl border border-emerald-200/80 p-5 shadow-soft sticky top-28 space-y-6">
              
              {/* Faculty Profile Badge */}
              <div className="flex items-center gap-3.5 pb-5 border-b border-slate-100">
                <img
                  src={user?.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300'}
                  alt={user?.name}
                  className="w-12 h-12 rounded-2xl object-cover ring-2 ring-emerald-500/30"
                />
                <div className="min-w-0">
                  <h4 className="font-bold text-slate-900 text-sm truncate">{user?.name || 'Prof. R. K. Patel'}</h4>
                  <p className="text-xs text-emerald-700 font-semibold truncate">{user?.department || 'Computer Engineering'}</p>
                  <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 text-[10px] font-bold rounded-md bg-emerald-50 text-emerald-700 uppercase border border-emerald-200">
                    <ShieldCheck className="w-3 h-3" /> Faculty Staff
                  </span>
                </div>
              </div>

              {/* Navigation Links */}
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
                          ? 'bg-emerald-700 text-white shadow-md shadow-emerald-700/20'
                          : 'text-slate-600 hover:bg-emerald-50 hover:text-emerald-900'
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

          {/* Main Content */}
          <main className="lg:col-span-9">
            <Outlet />
          </main>

        </div>
      </div>

      <Footer />
    </div>
  );
};

export default FacultyLayout;
