import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { useToast } from '../../context/ToastContext';
import SearchBar from '../../components/common/SearchBar';
import Select from '../../components/common/Select';
import StatusBadge from '../../components/common/StatusBadge';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import Button from '../../components/common/Button';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import { Users, Shield, Ban, Trash2, CheckCircle2 } from 'lucide-react';
import { formatDate } from '../../utils/formatters';

const AdminUsersPage = () => {
  const toast = useToast();
  const showToast = toast?.showToast || toast?.showSuccess || console.log;
  const showError = toast?.showToast ? (m) => toast.showToast(m, 'error') : toast?.showError || console.error;
  const showSuccess = toast?.showToast ? (m) => toast.showToast(m, 'success') : toast?.showSuccess || console.log;

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  
  const [selectedUser, setSelectedUser] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await adminService.getUsers({ search, role: roleFilter });
      setUsers(res.users || []);
    } catch (err) {
      showError('Failed to load user list.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [search, roleFilter]);

  const handleToggleStatus = async (user) => {
    const currentStatus = user.accountStatus || user.status || 'active';
    const newStatus = currentStatus.toLowerCase() === 'active' ? 'inactive' : 'active';
    const userId = user._id || user.id;

    try {
      await adminService.updateUserStatus(userId, newStatus);
      showSuccess(`User ${user.name} is now ${newStatus.toUpperCase()}`);
      fetchUsers();
    } catch (err) {
      showError(err.message || 'Status update failed.');
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await adminService.updateUserRole(userId, newRole);
      showSuccess(`Role updated to ${newRole.toUpperCase()}`);
      fetchUsers();
    } catch (err) {
      showError(err.message || 'Role change failed.');
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    const userId = selectedUser._id || selectedUser.id;
    try {
      await adminService.deleteUser(userId);
      showSuccess('User account removed');
      setConfirmOpen(false);
      fetchUsers();
    } catch (err) {
      showError(err.message || 'Failed to remove user');
    }
  };

  if (loading) return <LoadingSkeleton type="details" />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-soft">
        <h1 className="text-2xl font-black text-slate-900">User Management</h1>
        <p className="text-xs text-slate-500 mt-1">
          Review registered campus users, assign administration roles, or block compromised accounts.
        </p>

        <div className="mt-6 flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <SearchBar
              value={search}
              onChange={(val) => setSearch(val)}
              placeholder="Search by student name, email, ID..."
            />
          </div>
          <div className="w-full sm:w-48">
            <Select
              options={[
                { value: 'all', label: 'All Roles' },
                { value: 'student', label: 'Students' },
                { value: 'staff', label: 'Staff / Security' },
                { value: 'admin', label: 'Administrators' }
              ]}
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-soft">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 uppercase text-[10px] font-bold text-slate-400 tracking-wider border-b border-slate-100">
              <tr>
                <th className="p-4">Campus User</th>
                <th className="p-4">College Email</th>
                <th className="p-4">Role Permission</th>
                <th className="p-4">Registered Date</th>
                <th className="p-4">Account Status</th>
                <th className="p-4 text-right">Administrative Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((usr) => {
                const userId = usr._id || usr.id;
                const status = usr.accountStatus || usr.status || 'active';
                const isActive = status.toLowerCase() === 'active';
                const role = usr.role === 'faculty' ? 'staff' : usr.role;

                return (
                  <tr key={userId} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-4 font-bold text-slate-900 flex items-center gap-3">
                      <img
                        src={usr.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=300'}
                        alt={usr.name}
                        className="w-9 h-9 rounded-xl object-cover border border-slate-100 shrink-0"
                      />
                      <div>
                        <p>{usr.name}</p>
                        <span className="text-[10px] font-normal text-slate-400">
                          {usr.collegeId || usr.studentId || usr.department || 'N/A'}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 font-medium text-slate-600">{usr.email}</td>
                    <td className="p-4">
                      <select
                        value={role}
                        onChange={(e) => handleRoleChange(userId, e.target.value)}
                        className="bg-slate-100 border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-semibold text-slate-800 focus:outline-none focus:border-blue-500"
                      >
                        <option value="student">Student</option>
                        <option value="staff">Staff</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="p-4 font-medium text-slate-500">
                      {formatDate(usr.createdAt || usr.joinedDate)}
                    </td>
                    <td className="p-4">
                      <StatusBadge status={isActive ? 'active' : 'inactive'} size="sm" />
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant={isActive ? 'outline' : 'success'}
                          size="sm"
                          onClick={() => handleToggleStatus(usr)}
                        >
                          {isActive ? 'Deactivate' : 'Activate'}
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          icon={Trash2}
                          onClick={() => { setSelectedUser(usr); setConfirmOpen(true); }}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmDialog
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleDeleteUser}
        title="Remove Campus User?"
        message={`Are you sure you want to permanently delete user account for ${selectedUser?.name}? This action cannot be undone.`}
      />
    </div>
  );
};

export default AdminUsersPage;
