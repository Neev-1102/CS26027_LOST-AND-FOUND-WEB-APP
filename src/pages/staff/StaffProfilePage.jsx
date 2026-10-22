import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { authService } from '../../services/authService';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { User, Mail, Phone, Building, Save } from 'lucide-react';
import { getInitials } from '../../utils/userHelper';

const StaffProfilePage = () => {
  const { user, setUser } = useAuth();
  const { showToast } = useToast();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [department, setDepartment] = useState(user?.department || '');
  const [saving, setSaving] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await authService.updateProfile({ name, phone, department });
      if (res.user) setUser(res.user);
      showToast('Staff profile updated successfully!', 'success');
    } catch (err) {
      showToast(err.message || 'Failed to update profile', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900">Staff Profile & Desk Assignment</h1>
        <p className="text-xs text-slate-500">Manage your campus security desk contact information.</p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="flex items-center gap-4 mb-8 pb-6 border-b border-slate-100">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white font-extrabold text-xl flex items-center justify-center shadow-sm tracking-wider shrink-0">
            {getInitials(user?.name)}
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">{user?.name}</h2>
            <p className="text-xs text-slate-500">{user?.email}</p>
            <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 uppercase">
              Staff Clearance
            </span>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <Input
            label="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            icon={User}
            required
          />

          <Input
            label="College Email"
            value={user?.email || ''}
            icon={Mail}
            disabled
          />

          <Input
            label="Assigned Department / Desk"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            icon={Building}
          />

          <Input
            label="Contact Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            icon={Phone}
          />

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <Button type="submit" variant="primary" loading={saving} icon={Save}>
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StaffProfilePage;
