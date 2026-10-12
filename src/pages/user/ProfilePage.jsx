import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { userService } from '../../services/userService';
import { useToast } from '../../context/ToastContext';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';
import { User, Mail, Phone, IdCard, Building, Lock, Edit3, ShieldCheck } from 'lucide-react';

const ProfilePage = () => {
  const { user, setUser } = useAuth();
  const { showSuccess, showError } = useToast();

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);

  // Edit Profile Form State
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [department, setDepartment] = useState(user?.department || 'Computer Science');
  const [avatar, setAvatar] = useState(user?.avatar || '');

  // Password Form State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [loading, setLoading] = useState(false);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const updated = await userService.updateProfile({ name, phone, department, avatar });
      setUser(updated);
      showSuccess('Profile information updated successfully!');
      setEditModalOpen(false);
    } catch (err) {
      showError(err.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      showError('New passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      await userService.changePassword({ currentPassword, newPassword });
      showSuccess('Password updated successfully!');
      setPasswordModalOpen(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      showError(err.message || 'Failed to update password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Profile Header Card */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-soft">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300'}
            alt={user?.name}
            className="w-24 h-24 rounded-3xl object-cover ring-4 ring-blue-500/20 shadow-md"
          />
          <div className="text-center sm:text-left space-y-1 min-w-0 flex-1">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <h1 className="text-2xl font-black text-slate-900">{user?.name}</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase">
                {user?.role}
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">{user?.email}</p>
            <div className="flex items-center justify-center sm:justify-start gap-3 pt-2 text-xs text-slate-600 font-medium">
              <span className="flex items-center gap-1">
                <IdCard className="w-3.5 h-3.5 text-blue-600" /> {user?.studentId}
              </span>
              <span className="flex items-center gap-1">
                <Building className="w-3.5 h-3.5 text-slate-400" /> {user?.department || 'General Studies'}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-2 w-full sm:w-auto">
            <Button
              variant="outline"
              size="sm"
              icon={Edit3}
              onClick={() => setEditModalOpen(true)}
            >
              Edit Profile
            </Button>
            <Button
              variant="ghost"
              size="sm"
              icon={Lock}
              onClick={() => setPasswordModalOpen(true)}
            >
              Change Password
            </Button>
          </div>
        </div>
      </div>

      {/* Account Info Grid */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-soft space-y-4">
        <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
          Institutional Identity & Verification
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
            <span className="text-slate-400 font-semibold uppercase text-[10px]">College Email</span>
            <p className="font-bold text-slate-900 text-sm">{user?.email}</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
            <span className="text-slate-400 font-semibold uppercase text-[10px]">Student / Faculty ID</span>
            <p className="font-bold text-slate-900 text-sm">{user?.studentId}</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
            <span className="text-slate-400 font-semibold uppercase text-[10px]">Phone Number</span>
            <p className="font-bold text-slate-900 text-sm">{user?.phone || '+1 (555) 234-5678'}</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
            <span className="text-slate-400 font-semibold uppercase text-[10px]">Account Status</span>
            <p className="font-bold text-emerald-600 text-sm flex items-center gap-1">
              <ShieldCheck className="w-4 h-4" /> Active & Verified
            </p>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Edit Profile Information"
      >
        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <Input
            label="Full Name"
            icon={User}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <Input
            label="Phone Number"
            icon={Phone}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <Input
            label="Department / Faculty Major"
            icon={Building}
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
          />

          <Input
            label="Avatar Image URL"
            value={avatar}
            onChange={(e) => setAvatar(e.target.value)}
            helperText="Enter direct image URL for profile photo"
          />

          <div className="pt-3 border-t border-slate-100 flex justify-end gap-3">
            <Button variant="outline" onClick={() => setEditModalOpen(false)} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={loading}>
              Save Profile
            </Button>
          </div>
        </form>
      </Modal>

      {/* Change Password Modal */}
      <Modal
        isOpen={passwordModalOpen}
        onClose={() => setPasswordModalOpen(false)}
        title="Change Security Password"
      >
        <form onSubmit={handleChangePassword} className="space-y-4">
          <Input
            label="Current Password"
            type="password"
            required
            icon={Lock}
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />

          <Input
            label="New Password"
            type="password"
            required
            icon={Lock}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />

          <Input
            label="Confirm New Password"
            type="password"
            required
            icon={Lock}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <div className="pt-3 border-t border-slate-100 flex justify-end gap-3">
            <Button variant="outline" onClick={() => setPasswordModalOpen(false)} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={loading}>
              Update Password
            </Button>
          </div>
        </form>
      </Modal>

    </div>
  );
};

export default ProfilePage;
