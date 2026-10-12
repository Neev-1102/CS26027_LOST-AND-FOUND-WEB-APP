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

const AdminUsersPage = () => {
  const { showSuccess, showError } = useToast();
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
    const newStatus = user.status === 'Active' ? 'Blocked' : 'Active';
    try {
      await adminService.updateUserStatus(user.id, newStatus);
      showSuccess(`User ${user.name} is now ${newStatus}`);
      fetchUsers();
    } catch (err) {
      showError(err.message || 'Status update failed.');
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await adminService.updateUserRole(userId, newRole);
      showSuccess(`Role updated to ${newRole}`);
      fetchUsers();
    } catch (err) {
      showError(err.message || 'Role change failed.');
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    try {
      await adminService.deleteUser(selectedUser.id);
      showSuccess('User account removed');
      setConfirmOpen(false);
      fetchUsers();
    } catch (err) {
      showError('Failed to remove user');
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
                { value: 'faculty', label: 'Faculty' },
                { value: 'admin', label: 'Administrators' }
              ]}
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              placeholder=""
            />
          </div>
        </div>
      </div>

      {/* User Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-soft">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 uppercase text-[10px] font-bold text-slate-400 tracking-wider border-b border-slate-100">
              <tr>
                <th className="p-4">User</th>
                <th className="p-4">Email</th>
                <th className="p-4">Role</th>
                <th className="p-4">Joined Date</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((usr) => (
                <tr key={usr.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="p-4 font-bold text-slate-900 flex items-center gap-3">
                    <img src={usr.avatar} alt={usr.name} className="w-9 h-9 rounded-xl object-cover" />
                    <div>
                      <p>{usr.name}</p>
                      <span className="text-[10px] font-normal text-slate-400">{usr.studentId}</span>
                    </div>
                  </td>
                  <td className="p-4 font-medium text-slate-600">{usr.email}</td>
                  <td className="p-4">
                    <select
                      value={usr.role}
                      onChange={(e) => handleRoleChange(usr.id, e.target.value)}
                      className="bg-slate-100 border border-slate-200 rounded-lg px-2 py-1 text-xs font-semibold text-slate-800 focus:outline-none"
                    >
                      <option value="student">Student</option>
                      <option value="faculty">Faculty</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="p-4 font-medium text-slate-500">{usr.joinedDate}</td>
                  <td className="p-4">
                    <StatusBadge status={usr.status} size="sm" />
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant={usr.status === 'Active' ? 'outline' : 'success'}
                        size="sm"
                        onClick={() => handleToggleStatus(usr)}
                      >
                        {usr.status === 'Active' ? 'Block' : 'Unblock'}
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
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmDialog
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleDeleteUser}
        title="Remove Campus User?"
        message={`Are you sure you want to permanently delete user account for ${selectedUser?.name}?`}
      />

    </div>
  );
};

export default AdminUsersPage;
