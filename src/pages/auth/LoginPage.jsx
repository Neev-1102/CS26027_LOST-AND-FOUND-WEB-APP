import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import {
  Mail,
  Lock,
  LogIn,
  Search,
  ShieldCheck,
  GraduationCap,
  Building2,
} from 'lucide-react';
import Button from '../../components/common/Button';

const PRESET_ACCOUNTS = [
  {
    role: 'student',
    title: 'Student Demo',
    email: 'student@charusat.edu.in',
    password: 'student123',
    icon: GraduationCap,
    desc: 'Report lost items, browse available claims, track status',
  },
  {
    role: 'staff',
    title: 'Staff Desk',
    email: 'staff@charusat.edu.in',
    password: 'staff123',
    icon: Building2,
    desc: 'Register found items into custody, review claims, handovers',
  },
  {
    role: 'admin',
    title: 'System Admin',
    email: 'admin@charusat.edu.in',
    password: 'admin123',
    icon: ShieldCheck,
    desc: 'Manage users, staff provisioning, categories, audit logs',
  },
];

const LoginPage = () => {
  const { login, isAuthenticated, user } = useAuth();
  const toast = useToast();
  const showToast = toast?.showToast || toast?.addToast || toast?.showSuccess || console.log;
  const navigate = useNavigate();
  const location = useLocation();

  const [selectedRoleTab, setSelectedRoleTab] = useState('student');

  useEffect(() => {
    if (isAuthenticated && user) {
      const role = user.role === 'faculty' ? 'staff' : user.role || 'student';
      if (role === 'admin') {
        navigate('/admin/dashboard', { replace: true });
      } else if (role === 'staff') {
        navigate('/staff/dashboard', { replace: true });
      } else {
        navigate('/student/dashboard', { replace: true });
      }
    }
  }, [isAuthenticated, user, navigate]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      email: 'student@charusat.edu.in',
      password: 'student123',
    },
  });

  const handleSelectPreset = (preset) => {
    setSelectedRoleTab(preset.role);
    setValue('email', preset.email, { shouldValidate: true });
    setValue('password', preset.password, { shouldValidate: true });
    showToast(`Loaded ${preset.title} credentials`, 'info');
  };

  const onSubmit = async (data) => {
    try {
      const res = await login(data.email, data.password, selectedRoleTab);
      const userObj = res?.user || user;
      const role = userObj?.role === 'faculty' ? 'staff' : userObj?.role || 'student';
      showToast(`Welcome back, ${userObj?.name || 'User'}!`, 'success');

      if (role === 'admin') {
        navigate('/admin/dashboard', { replace: true });
      } else if (role === 'staff') {
        navigate('/staff/dashboard', { replace: true });
      } else {
        const from =
          location.state?.from?.pathname ||
          (typeof location.state?.from === 'string' ? location.state.from : null);
        const destination = from && from !== '/login' ? from : '/student/dashboard';
        navigate(destination, { replace: true });
      }
    } catch (err) {
      showToast(err.message || 'Login failed. Please verify credentials.', 'error');
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-slate-50">
      <div className="w-full max-w-xl bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 sm:p-10 my-6">
        {/* Brand Header */}
        <div className="text-center space-y-2 mb-8">
          <Link to="/" className="inline-flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <Search className="w-5 h-5 text-white stroke-[2.5]" />
            </div>
            <span className="font-extrabold text-2xl tracking-tight text-slate-900">
              Campus<span className="text-blue-600">Find</span>
            </span>
          </Link>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Portal Authentication</h2>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Select your campus portal role and sign in with your authorized credentials.
          </p>
        </div>

        {/* Role Tabs */}
        <div className="grid grid-cols-3 gap-2 p-1.5 bg-slate-100 rounded-2xl mb-6">
          {PRESET_ACCOUNTS.map((preset) => {
            const Icon = preset.icon;
            const isSelected = selectedRoleTab === preset.role;
            return (
              <button
                key={preset.role}
                type="button"
                onClick={() => handleSelectPreset(preset)}
                className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
                  isSelected
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="capitalize">{preset.role}</span>
              </button>
            );
          })}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-700">
              College Email <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                placeholder="e.g. student@charusat.edu.in"
                className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 border rounded-xl text-sm focus:bg-white focus:outline-none transition-all ${
                  errors.email ? 'border-rose-300 focus:border-rose-500' : 'border-slate-200 focus:border-blue-500'
                }`}
                {...register('email', {
                  required: 'College email is required',
                  pattern: {
                    value: /^\S+@\S+\.\S+$/,
                    message: 'Please provide a valid email format',
                  },
                })}
              />
            </div>
            {errors.email && <p className="text-xs text-rose-500">{errors.email.message}</p>}
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-slate-700">
                Password <span className="text-rose-500">*</span>
              </label>
              <Link to="/forgot-password" className="text-xs text-blue-600 hover:underline">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                placeholder="••••••••"
                className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 border rounded-xl text-sm focus:bg-white focus:outline-none transition-all ${
                  errors.password ? 'border-rose-300 focus:border-rose-500' : 'border-slate-200 focus:border-blue-500'
                }`}
                {...register('password', { required: 'Password is required' })}
              />
            </div>
            {errors.password && <p className="text-xs text-rose-500">{errors.password.message}</p>}
          </div>

          <Button type="submit" variant="primary" loading={isSubmitting} className="w-full mt-2" icon={LogIn}>
            Sign In to {selectedRoleTab.toUpperCase()} Portal
          </Button>

          <div className="text-center pt-4 border-t border-slate-100">
            <p className="text-xs text-slate-500">
              New student at campus?{' '}
              <Link to="/register" className="font-bold text-blue-600 hover:underline">
                Create Student Account
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
