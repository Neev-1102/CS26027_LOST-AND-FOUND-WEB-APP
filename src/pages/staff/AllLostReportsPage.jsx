import React, { useState, useEffect } from 'react';
import { lostItemService } from '../../services/lostItemService';
import { useToast } from '../../context/ToastContext';
import DashboardTable from '../../components/dashboard/DashboardTable';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import Textarea from '../../components/common/Textarea';
import { formatDate } from '../../utils/formatters';
import { Check, X, ShieldAlert } from 'lucide-react';

const AllLostReportsPage = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);
  const [statusToSet, setStatusToSet] = useState('approved');
  const [reviewRemark, setReviewRemark] = useState('');
  const [updating, setUpdating] = useState(false);
  const { showToast } = useToast();

  const fetchReports = async () => {
    try {
      setLoading(true);
      const res = await lostItemService.getAll();
      setReports(res.items || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleUpdateStatus = async () => {
    if (!selectedReport) return;
    setUpdating(true);
    try {
      await lostItemService.update(selectedReport._id || selectedReport.id, {
        status: statusToSet,
        reviewRemark,
      });
      showToast(`Report updated to ${statusToSet.toUpperCase()}`, 'success');
      setSelectedReport(null);
      setReviewRemark('');
      fetchReports();
    } catch (err) {
      showToast(err.message || 'Failed to update report', 'error');
    } finally {
      setUpdating(false);
    }
  };

  const columns = [
    {
      header: 'Reported Item',
      accessor: 'itemName',
      render: (row) => (
        <div>
          <span className="font-bold text-slate-900 block">{row.itemName || row.title}</span>
          <span className="text-slate-400 text-[11px]">{row.category} • Color: {row.color}</span>
        </div>
      ),
    },
    {
      header: 'Reporter',
      render: (row) => (
        <span className="text-xs text-slate-700">
          {row.reportedBy?.name || row.reporterName || 'Student'}
        </span>
      ),
    },
    {
      header: 'Location Lost',
      accessor: 'locationLost',
      render: (row) => <span className="text-xs text-slate-600">{row.locationLost || row.location}</span>,
    },
    {
      header: 'Date Lost',
      accessor: 'dateLost',
      render: (row) => formatDate(row.dateLost || row.date),
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      header: 'Staff Actions',
      render: (row) => (
        <div className="flex items-center gap-2">
          {row.status === 'pending_review' ? (
            <>
              <button
                onClick={() => {
                  setSelectedReport(row);
                  setStatusToSet('approved');
                }}
                className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs font-bold flex items-center gap-1"
                title="Approve Report"
              >
                <Check className="w-3.5 h-3.5" /> Approve
              </button>
              <button
                onClick={() => {
                  setSelectedReport(row);
                  setStatusToSet('rejected');
                }}
                className="p-1.5 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 text-xs font-bold flex items-center gap-1"
                title="Reject Report"
              >
                <X className="w-3.5 h-3.5" /> Reject
              </button>
            </>
          ) : (
            <button
              onClick={() => {
                setSelectedReport(row);
                setStatusToSet(row.status === 'approved' ? 'resolved' : 'approved');
              }}
              className="text-xs font-bold text-blue-600 hover:underline"
            >
              Update Status
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900">Student Lost Item Reports</h1>
        <p className="text-xs text-slate-500">
          Review, approve, or resolve lost item reports filed by campus students.
        </p>
      </div>

      {loading ? (
        <LoadingSpinner message="Loading lost reports..." />
      ) : (
        <DashboardTable
          columns={columns}
          data={reports}
          emptyMessage="No lost reports logged in the system."
        />
      )}

      {/* Review Modal */}
      {selectedReport && (
        <Modal
          isOpen={!!selectedReport}
          onClose={() => setSelectedReport(null)}
          title={`Review Lost Report: ${selectedReport.itemName || selectedReport.title}`}
        >
          <div className="space-y-4">
            <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
              <strong>Description:</strong> {selectedReport.description}
            </p>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                Set Report Status
              </label>
              <select
                value={statusToSet}
                onChange={(e) => setStatusToSet(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-blue-500"
              >
                <option value="approved">Approved (Publicly visible)</option>
                <option value="pending_review">Pending Review</option>
                <option value="resolved">Resolved (Owner recovered item)</option>
                <option value="rejected">Rejected (Inappropriate / Inaccurate)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                Staff Remark / Feedback for Student
              </label>
              <Textarea
                placeholder="Optional notes or instructions for the student..."
                value={reviewRemark}
                onChange={(e) => setReviewRemark(e.target.value)}
                rows={3}
              />
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
              <Button variant="secondary" onClick={() => setSelectedReport(null)}>
                Cancel
              </Button>
              <Button variant="primary" loading={updating} onClick={handleUpdateStatus}>
                Confirm Status
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default AllLostReportsPage;
