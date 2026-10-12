import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import Sidebar from './Sidebar';
import {
  LayoutDashboard,
  PlusCircle,
  Package,
  Search,
  FileCheck,
  Bell,
  User,
  KeyRound,
  Sparkles,
  Menu,
  X,
} from 'lucide-react';

const StudentLayout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const studentLinks = [
    { name: 'Student Dashboard', path: '/student/dashboard', icon: LayoutDashboard },
    { name: 'Report Lost Item', path: '/student/report-lost', icon: PlusCircle },
    { name: 'Report Found Item', path: '/student/report-found', icon: Sparkles },
    { name: 'My Lost Items', path: '/student/my-lost-items', icon: Package },
    { name: 'Available Claims', path: '/student/available-claims', icon: Search },
    { name: 'My Claims', path: '/student/my-claims', icon: FileCheck },
    { name: 'Notifications', path: '/student/notifications', icon: Bell, badge: true },
    { name: 'My Profile', path: '/student/profile', icon: User },
    { name: 'Change Password', path: '/student/change-password', icon: KeyRound },
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
                <LayoutDashboard className="w-4 h-4 text-blue-600" /> Student Portal Navigation
              </span>
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          {/* Desktop & Mobile Sidebar */}
          <div className={`lg:col-span-3 ${mobileMenuOpen ? 'block' : 'hidden lg:block'}`}>
            <Sidebar links={studentLinks} title="Student Menu" roleBadge="Student" />
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

export default StudentLayout;
