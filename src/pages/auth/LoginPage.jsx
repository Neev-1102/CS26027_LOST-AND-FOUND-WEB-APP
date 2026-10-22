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
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  RefreshCw,
  Server,
  ArrowRight,
} from 'lucide-react';
import Button from '../../components/common/Button';
import api from '../../services/api';

const PRESET_ACCOUNTS = [
  {
    role: 'student',
    title: 'Student Portal',
    email: 'student@charusat.edu.in',
    password: 'student123',
    icon: GraduationCap,
    badgeColor: 'bg-blue-100 text-blue-700 border-blue-200',
    activeTabClass: 'bg-white text-blue-600 shadow-sm border-blue-100',
    desc: 'Report lost items, track status, browse matching found items, submit ownership claims',
  },
  {
    role: 'staff',
    title: 'Staff Portal',
    email: 'staff@charusat.edu.in',
    password: 'staff123',
    icon: Building2,
    badgeColor: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    activeTabClass: 'bg-white text-emerald-600 shadow-sm border-emerald-100',
    desc: 'Register found property into custody, inspect claims & evidence, confirm physical handovers',
  },
  {
    role: 'admin',
    title: 'Admin Portal',
    email: 'admin@charusat.edu.in',
    password: 'admin123',
    icon: ShieldCheck,
    badgeColor: 'bg-purple-100 text-purple-700 border-purple-200',
    activeTabClass: 'bg-white text-purple-600 shadow-sm border-purple-100',
    desc: 'System oversight, user management, staff provisioning, categories, audit logs & analytics',
  },
];

const LoginPage = () => {
  const { login, isAuthenticated, user } = useAuth();
  const toast = useToast();
  const showToast = toast?.showToast || toast?.addToast || toast?.showSuccess || console.log;
  const navigate = useNavigate();
  const location = useLocation();

  const [selectedRoleTab, setSelectedRoleTab] = useState('student');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState(null);
  const [suggestedRole, setSuggestedRole] = useState(null);
  const [backendStatus, setBackendStatus] = useState('checking'); // 'online' | 'offline' | 'checking'

  // Proactively check backend health
  useEffect(() => {
    let isMounted = true;
    const checkHealth = async () => {
      try {
        const res = await api.get('/health', { timeout: 3000 });
        if (isMounted) {
          if (res.data?.status === 'OK') {
            setBackendStatus('online');
          } else {
            setBackendStatus('offline');
          }
        }
      } catch {
        if (isMounted) {
          setBackendStatus('offline');
        }
      }
    };
    checkHealth();
    return () => {
      isMounted = false;
    };
  }, []);

  // Redirect if already authenticated
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
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      email: 'student@charusat.edu.in',
      password: 'student123',
    },
  });

  const emailValue = watch('email');

  // Handle switching preset tab
  const handleSelectPreset = (preset) => {
    setSelectedRoleTab(preset.role);
    setValue('email', preset.email, { shouldValidate: true });
    setValue('password', preset.password, { shouldValidate: true });
    setLoginError(null);
    setSuggestedRole(null);
    showToast(`Loaded ${preset.title} credentials`, 'info');
  };

  // Perform login
  const executeLogin = async (email, password, role) => {
    setLoginError(null);
    setSuggestedRole(null);

    const cleanEmail = (email || '').trim();
    const cleanPassword = (password || '').trim();

    try {
      const res = await login(cleanEmail, cleanPassword, role);
      const userObj = res?.user || user;
      const finalRole = userObj?.role === 'faculty' ? 'staff' : userObj?.role || 'student';

      showToast(`Welcome back, ${userObj?.name || 'User'}!`, 'success');

      if (finalRole === 'admin') {
        navigate('/admin/dashboard', { replace: true });
      } else if (finalRole === 'staff') {
        navigate('/staff/dashboard', { replace: true });
      } else {
        const from =
          location.state?.from?.pathname ||
          (typeof location.state?.from === 'string' ? location.state.from : null);
        const destination = from && from !== '/login' ? from : '/student/dashboard';
        navigate(destination, { replace: true });
      }
    } catch (err) {
      const msg = err.message || 'Login failed. Please verify credentials.';
      setLoginError(msg);

      // Check for role mismatch hints (e.g. Registered as 'admin', but 'student' was selected)
      const roleMatch = msg.match(/registered as '([^']+)'/i);
      if (roleMatch && roleMatch[1]) {
        const matched = roleMatch[1].toLowerCase();
        const normalizedRole = matched === 'faculty' ? 'staff' : matched;
        setSuggestedRole(normalizedRole);
      } else {
        // Also infer by email prefix if obvious
        if (cleanEmail.includes('admin') && role !== 'admin') {
          setSuggestedRole('admin');
        } else if (cleanEmail.includes('staff') && role !== 'staff') {
          setSuggestedRole('staff');
        }
      }

      showToast(msg, 'error');
    }
  };

  const onSubmit = async (data) => {
    await executeLogin(data.email, data.password, selectedRoleTab);
  };

  // Quick switch role and retry
  const handleSwitchRoleAndLogin = async (targetRole) => {
    setSelectedRoleTab(targetRole);
    setSuggestedRole(null);
    const preset = PRESET_ACCOUNTS.find((p) => p.role === targetRole);
    const emailToUse = preset ? preset.email : watch('email');
    const passwordToUse = preset ? preset.password : watch('password');

    if (preset) {
      setValue('email', preset.email);
      setValue('password', preset.password);
    }
    await executeLogin(emailToUse, passwordToUse, targetRole);
  };

  const activePreset = PRESET_ACCOUNTS.find((p) => p.role === selectedRoleTab) || PRESET_ACCOUNTS[0];
  const ActiveIcon = activePreset.icon;

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-slate-50">
      <div className="w-full max-w-xl bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 sm:p-10 my-6">
        {/* Brand Header */}
        <div className="text-center space-y-2 mb-6">
          <Link to="/" className="inline-flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <Search className="w-5 h-5 text-white stroke-[2.5]" />
            </div>
            <span className="font-extrabold text-2xl tracking-tight text-slate-900">
              Campus<span className="text-blue-600">Find</span>
            </span>
          </Link>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Portal Authentication</h2>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Choose your campus portal role. Antigravity enforces strict role-based access for students, staff, and administrators.
          </p>

          {/* System status indicator badge */}
          <div className="pt-1 flex items-center justify-center">
            {backendStatus === 'online' ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <Server className="w-3 h-3" />
                Live MongoDB API Connected (Port 5000)
              </span>
            ) : backendStatus === 'offline' ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                Demo Simulation Mode Active (Presets Ready)
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium bg-slate-100 text-slate-600">
                <RefreshCw className="w-3 h-3 animate-spin" />
                Connecting to Campus Services...
              </span>
            )}
          </div>
        </div>

        {/* Role Tabs */}
        <div className="grid grid-cols-3 gap-2 p-1.5 bg-slate-100 rounded-2xl mb-4">
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
                    ? preset.activeTabClass
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="capitalize">{preset.role}</span>
              </button>
            );
          })}
        </div>

        {/* Selected Role Info Card */}
        <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl mb-5 flex items-start gap-3">
          <div className="p-2 bg-white rounded-lg border border-slate-200 shadow-2xs shrink-0 text-slate-700">
            <ActiveIcon className="w-4 h-4 text-blue-600" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold text-slate-900 capitalize">{activePreset.title}</p>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-600">
                {activePreset.role}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed mt-0.5">{activePreset.desc}</p>
          </div>
        </div>

        {/* Error Alert Box with Recovery Suggestions */}
        {loginError && (
          <div className="mb-5 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-xs space-y-2 animate-fadeIn">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-bold text-rose-950">Authentication Notice</p>
                <p className="mt-0.5 text-rose-800">{loginError}</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setLoginError(null);
                  setSuggestedRole(null);
                }}
                className="text-rose-400 hover:text-rose-700 text-sm font-bold leading-none p-1"
                aria-label="Dismiss"
              >
                ×
              </button>
            </div>

            {/* Quick Switch Button if role mismatch */}
            {suggestedRole && (
              <div className="pt-1.5 border-t border-rose-200/70 flex items-center justify-between gap-2">
                <span className="text-[11px] text-rose-700">
                  Switch to <strong>{suggestedRole.toUpperCase()}</strong> portal?
                </span>
                <button
                  type="button"
                  onClick={() => handleSwitchRoleAndLogin(suggestedRole)}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg text-xs shadow-xs transition-colors"
                >
                  <span>Switch & Sign In</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            )}

            {/* Hint for running backend if network issue */}
            {loginError.toLowerCase().includes('network') && (
              <p className="text-[11px] text-rose-700 pt-1">
                💡 Tip: Start the fullstack backend with <code className="bg-rose-100 px-1 py-0.5 rounded font-mono">npm run dev</code> or continue using demo accounts below.
              </p>
            )}
          </div>
        )}

        {/* Login Form */}
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
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                className={`w-full pl-10 pr-10 py-2.5 bg-slate-50 border rounded-xl text-sm focus:bg-white focus:outline-none transition-all ${
                  errors.password ? 'border-rose-300 focus:border-rose-500' : 'border-slate-200 focus:border-blue-500'
                }`}
                {...register('password', { required: 'Password is required' })}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && <p className="text-xs text-rose-500">{errors.password.message}</p>}
          </div>

          <Button type="submit" variant="primary" loading={isSubmitting} className="w-full mt-2" icon={LogIn}>
            Sign In to {selectedRoleTab.toUpperCase()} Portal
          </Button>

          {/* Quick 1-Click Demo Logins */}
          <div className="pt-2">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 text-center">
              Quick 1-Click Demo Accounts
            </p>
            <div className="grid grid-cols-3 gap-2">
              {PRESET_ACCOUNTS.map((preset) => (
                <button
                  key={preset.role}
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => handleSelectPreset(preset)}
                  className={`py-2 px-2 rounded-xl text-[11px] font-bold border transition-all text-center flex flex-col items-center gap-1 ${
                    selectedRoleTab === preset.role
                      ? 'bg-blue-50/80 border-blue-200 text-blue-700 font-extrabold'
                      : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span className="capitalize">{preset.role}</span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {preset.password}
                  </span>
                </button>
              ))}
            </div>
          </div>

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
