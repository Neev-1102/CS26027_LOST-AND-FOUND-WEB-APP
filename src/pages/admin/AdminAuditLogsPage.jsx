import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import DashboardTable from '../../components/dashboard/DashboardTable';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { ShieldCheck, Search } from 'lucide-react';
import { formatDateTime } from '../../utils/formatters';

const AdminAuditLogsPage = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setLoading(true);
        const res = await adminService.getAuditLogs({ limit: 100 });
        setLogs(res.logs || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  const filteredLogs = logs.filter((log) => {
    if (!search) return true;
    const q = search.toLowerCase();
    const action = (log.action || '').toLowerCase();
    const summary = (log.summary || '').toLowerCase();
    const actor = (log.actor?.name || log.actor?.email || '').toLowerCase();
    return action.includes(q) || summary.includes(q) || actor.includes(q);
  });

  const columns = [
    {
      header: 'Operation Action',
      accessor: 'action',
      render: (row) => (
        <span className="font-mono text-xs font-bold text-purple-700 bg-purple-50 border border-purple-200 px-2.5 py-1 rounded-lg">
          {row.action}
        </span>
      ),
    },
    {
      header: 'Summary',
      accessor: 'summary',
      render: (row) => <span className="text-xs text-slate-800 font-medium">{row.summary}</span>,
    },
    {
      header: 'Actor',
      accessor: 'actor',
      render: (row) => (
        <div>
          <span className="font-bold text-slate-900 block text-xs">{row.actor?.name || 'Administrator'}</span>
          <span className="text-[11px] text-slate-400 capitalize">{row.actor?.role}</span>
        </div>
      ),
    },
    {
      header: 'Target Resource',
      accessor: 'targetType',
      render: (row) => (
        <span className="text-[11px] font-mono text-slate-500">
          {row.targetType} #{row.targetId?.slice(-6) || ''}
        </span>
      ),
    },
    {
      header: 'Timestamp',
      accessor: 'createdAt',
      render: (row) => <span className="text-xs text-slate-400">{formatDateTime(row.createdAt)}</span>,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">System Activity & Audit Logs</h1>
          <p className="text-xs text-slate-500">
            Immutable tracking of privileged staff and administrative actions across the platform.
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Filter logs by keyword..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {loading ? (
        <LoadingSpinner message="Retrieving audit records..." />
      ) : (
        <DashboardTable
          columns={columns}
          data={filteredLogs}
          emptyMessage="No matching audit logs found."
        />
      )}
    </div>
  );
};

export default AdminAuditLogsPage;
