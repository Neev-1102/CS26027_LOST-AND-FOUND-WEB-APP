import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import Sidebar from './Sidebar';
import {
  LayoutDashboard,
  Users,
  UserPlus,
  Package,
  PackageSearch,
  FileCheck,
  Tags,
  BarChart3,
  ShieldCheck,
  Settings,
  User,
  Menu,
  X,
} from 'lucide-react';

const AdminLayout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const adminLinks = [
    { name: 'Admin Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'User Management', path: '/admin/users', icon: Users },
    { name: 'Create Staff', path: '/admin/staff', icon: UserPlus },
    { name: 'Lost Items', path: '/admin/lost-items', icon: Package },
    { name: 'Found Items', path: '/admin/found-items', icon: PackageSearch },
    { name: 'Claims Oversight', path: '/admin/claims', icon: FileCheck },
    { name: 'Categories', path: '/admin/categories', icon: Tags },
    { name: 'Reports & Analytics', path: '/admin/analytics', icon: BarChart3 },
    { name: 'Audit Logs', path: '/admin/audit-logs', icon: ShieldCheck },
    { name: 'System Settings', path: '/admin/settings', icon: Settings },
    { name: 'Admin Profile', path: '/admin/profile', icon: User },
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
                <LayoutDashboard className="w-4 h-4 text-purple-600" /> Admin Navigation
              </span>
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          {/* Desktop & Mobile Sidebar */}
          <div className={`lg:col-span-3 ${mobileMenuOpen ? 'block' : 'hidden lg:block'}`}>
            <Sidebar links={adminLinks} title="Administration Menu" roleBadge="Admin" />
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

export default AdminLayout;
