import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import DashboardTable from '../../components/dashboard/DashboardTable';
import { History, ShieldCheck } from 'lucide-react';
import { formatDateTime } from '../../utils/formatters';

const StaffActivityHistoryPage = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setLoading(true);
        const res = await adminService.getAuditLogs({ limit: 30 });
        setLogs(res.logs || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  const columns = [
    {
      header: 'Operation Action',
      accessor: 'action',
      render: (row) => (
        <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
          {row.action}
        </span>
      ),
    },
    {
      header: 'Summary Details',
      accessor: 'summary',
      render: (row) => <span className="text-xs text-slate-800 font-medium">{row.summary}</span>,
    },
    {
      header: 'Staff Actor',
      accessor: 'actor',
      render: (row) => (
        <span className="text-xs text-slate-600">
          {row.actor?.name || 'Authorized Staff'}
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
      <div>
        <h1 className="text-2xl font-black text-slate-900">Staff Activity & Custody Logs</h1>
        <p className="text-xs text-slate-500">
          Audited log of item intakes, claim reviews, and verified handovers.
        </p>
      </div>

      {loading ? (
        <LoadingSpinner message="Loading audit history..." />
      ) : (
        <DashboardTable
          columns={columns}
          data={logs}
          emptyMessage="No recent operations recorded in audit log."
        />
      )}
    </div>
  );
};

export default StaffActivityHistoryPage;
