import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import {
  User,
  Mail,
  Phone,
  CreditCard,
  Lock,
  UserPlus,
  Search,
  Building,
  AlertCircle,
  ArrowRight,
} from 'lucide-react';
import Button from '../../components/common/Button';

const RegisterPage = () => {
  const { register: registerAuth } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [regError, setRegError] = useState(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      studentId: '',
      department: 'Computer Engineering',
      phone: '',
      password: '',
      confirmPassword: '',
    },
  });

  const passwordWatch = watch('password');

  const onSubmit = async (formData) => {
    setRegError(null);
    try {
      await registerAuth({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: (formData.phone || '').trim(),
        collegeId: (formData.studentId || '').trim(),
        department: formData.department,
        password: formData.password.trim(),
      });

      showToast('Student account registered successfully! Welcome to CampusFind.', 'success');
      navigate('/student/dashboard');
    } catch (err) {
      const msg = err.message || 'Registration failed. Please verify your details.';
      setRegError(msg);
      showToast(msg, 'error');
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
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Student Registration
          </h2>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Create your student account to report lost property, track claims, and receive real-time notifications.
            (Staff and Admin accounts are provisioned via administrative operations).
          </p>
        </div>

        {/* Error Alert Box */}
        {regError && (
          <div className="mb-5 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-xs space-y-2 animate-fadeIn">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-bold text-rose-950">Registration Notice</p>
                <p className="mt-0.5 text-rose-800">{regError}</p>
              </div>
              <button
                type="button"
                onClick={() => setRegError(null)}
                className="text-rose-400 hover:text-rose-700 text-sm font-bold leading-none p-1"
                aria-label="Dismiss"
              >
                ×
              </button>
            </div>
            {regError.toLowerCase().includes('already exists') && (
              <div className="pt-1.5 border-t border-rose-200/70 flex items-center justify-between gap-2">
                <span className="text-[11px] text-rose-700">Already registered with this college email?</span>
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1 px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg text-xs shadow-xs transition-colors"
                >
                  <span>Go to Login</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Register Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Full Name */}
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-700">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="e.g. Neev Patel"
                  className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 border rounded-xl text-sm focus:bg-white focus:outline-none transition-all ${
                    errors.name ? 'border-rose-300' : 'border-slate-200 focus:border-blue-500'
                  }`}
                  {...register('name', { required: 'Full name is required' })}
                />
              </div>
              {errors.name && <p className="text-xs text-rose-500">{errors.name.message}</p>}
            </div>

            {/* Student ID */}
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-700">
                Student ID / Roll No <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <CreditCard className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="e.g. 24CS088"
                  className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 border rounded-xl text-sm focus:bg-white focus:outline-none transition-all ${
                    errors.studentId ? 'border-rose-300' : 'border-slate-200 focus:border-blue-500'
                  }`}
                  {...register('studentId', { required: 'Student ID is required' })}
                />
              </div>
              {errors.studentId && <p className="text-xs text-rose-500">{errors.studentId.message}</p>}
            </div>
          </div>

          {/* College Email */}
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-700">
              College Email ID <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                placeholder="e.g. student@charusat.edu.in"
                className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 border rounded-xl text-sm focus:bg-white focus:outline-none transition-all ${
                  errors.email ? 'border-rose-300' : 'border-slate-200 focus:border-blue-500'
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Department */}
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-700">Department</label>
              <div className="relative">
                <Building className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="e.g. Computer Engineering"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:border-blue-500 transition-all"
                  {...register('department')}
                />
              </div>
            </div>

            {/* Phone */}
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-700">Phone (Optional)</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:border-blue-500 transition-all"
                  {...register('phone')}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Password */}
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-700">
                Password <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  placeholder="At least 6 characters"
                  className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 border rounded-xl text-sm focus:bg-white focus:outline-none transition-all ${
                    errors.password ? 'border-rose-300' : 'border-slate-200 focus:border-blue-500'
                  }`}
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters',
                    },
                  })}
                />
              </div>
              {errors.password && <p className="text-xs text-rose-500">{errors.password.message}</p>}
            </div>

            {/* Confirm Password */}
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-700">
                Confirm Password <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  placeholder="Repeat password"
                  className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 border rounded-xl text-sm focus:bg-white focus:outline-none transition-all ${
                    errors.confirmPassword ? 'border-rose-300' : 'border-slate-200 focus:border-blue-500'
                  }`}
                  {...register('confirmPassword', {
                    required: 'Please confirm password',
                    validate: (val) => val === passwordWatch || 'Passwords do not match',
                  })}
                />
              </div>
              {errors.confirmPassword && (
                <p className="text-xs text-rose-500">{errors.confirmPassword.message}</p>
              )}
            </div>
          </div>

          <Button type="submit" variant="primary" loading={isSubmitting} className="w-full mt-4" icon={UserPlus}>
            Register Student Account
          </Button>

          <div className="text-center pt-4 border-t border-slate-100">
            <p className="text-xs text-slate-500">
              Already have a CampusFind account?{' '}
              <Link to="/login" className="font-bold text-blue-600 hover:underline">
                Sign in here
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
