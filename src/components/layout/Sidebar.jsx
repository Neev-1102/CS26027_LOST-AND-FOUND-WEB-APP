import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LogOut } from 'lucide-react';

const Sidebar = ({ links = [], title = 'Portal Menu', roleBadge = 'Role' }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm h-fit">
      {/* User Header */}
      <div className="flex items-center gap-3 p-3 mb-4 border-b border-slate-100">
        <img
          src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300'}
          alt={user?.name || 'User'}
          className="w-11 h-11 rounded-full object-cover border-2 border-blue-500 shadow-sm"
        />
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-bold text-slate-900 truncate">{user?.name || 'Campus User'}</h4>
          <span className="inline-block px-2 py-0.5 text-xs font-semibold rounded-full bg-blue-50 text-blue-700 uppercase tracking-wider">
            {roleBadge}
          </span>
        </div>
      </div>

      <div className="text-xs font-semibold uppercase tracking-wider text-slate-600 px-3 mb-2">
        {title}
      </div>

      <nav className="space-y-1">
        {links.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end || false}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`
              }
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">{item.name}</span>
              {item.badge && (
                <span className="ml-auto w-2 h-2 rounded-full bg-amber-500 ring-2 ring-white"></span>
              )}
            </NavLink>
          );
        })}
      </nav>

      <div className="pt-4 mt-4 border-t border-slate-100">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm text-rose-600 hover:bg-rose-50 transition-colors"
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
