import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, Home, LogIn } from 'lucide-react';
import Button from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';

const UnauthorizedPage = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const getDashboardPath = () => {
    if (!isAuthenticated) return '/login';
    if (user?.role === 'admin') return '/admin/dashboard';
    if (user?.role === 'staff' || user?.role === 'faculty') return '/staff/dashboard';
    return '/student/dashboard';
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 bg-slate-50">
      <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200/80 p-8 shadow-sm text-center">
        <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 mb-2">Access Denied</h1>
        <p className="text-sm text-slate-600 mb-6 leading-relaxed">
          You do not have the required permissions or role clearance to access this portal page.
          {user?.role && (
            <span className="block mt-2 font-semibold text-slate-800">
              Current account role: <span className="uppercase text-blue-600">{user.role}</span>
            </span>
          )}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button variant="secondary" onClick={() => navigate(-1)} icon={ArrowLeft}>
            Go Back
          </Button>
          <Link to={getDashboardPath()}>
            <Button variant="primary" icon={isAuthenticated ? Home : LogIn}>
              {isAuthenticated ? 'My Dashboard' : 'Sign In'}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
