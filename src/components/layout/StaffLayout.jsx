import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import Sidebar from './Sidebar';
import {
  LayoutDashboard,
  ClipboardList,
  PlusCircle,
  PackageCheck,
  FileCheck2,
  History,
  User,
  Menu,
  X,
} from 'lucide-react';

const StaffLayout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const staffLinks = [
    { name: 'Staff Dashboard', path: '/staff/dashboard', icon: LayoutDashboard },
    { name: 'All Lost Reports', path: '/staff/lost-reports', icon: ClipboardList },
    { name: 'Register Found Item', path: '/staff/register-found', icon: PlusCircle },
    { name: 'Found Items Inventory', path: '/staff/found-inventory', icon: PackageCheck },
    { name: 'Claim Management', path: '/staff/claims', icon: FileCheck2 },
    { name: 'Activity History', path: '/staff/activity', icon: History },
    { name: 'Staff Profile', path: '/staff/profile', icon: User },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Navbar />

      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Mobile Sidebar Toggle */}
          <div className="lg:hidden col-span-1 mb-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="w-full flex items-center justify-between p-3.5 bg-white border border-slate-200 rounded-2xl shadow-sm text-slate-800 font-bold text-sm"
            >
              <span className="flex items-center gap-2">
                <LayoutDashboard className="w-4 h-4 text-emerald-600" /> Staff Portal Navigation
              </span>
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          {/* Desktop & Mobile Sidebar */}
          <div className={`lg:col-span-3 ${mobileMenuOpen ? 'block' : 'hidden lg:block'}`}>
            <Sidebar links={staffLinks} title="Staff Desk Menu" roleBadge="Staff" />
          </div>

          {/* Main Content Area */}
          <main className="lg:col-span-9 min-w-0">
            <Outlet />
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default StaffLayout;
