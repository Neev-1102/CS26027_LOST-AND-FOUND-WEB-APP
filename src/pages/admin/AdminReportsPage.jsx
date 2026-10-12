import React from 'react';
import Button from '../../components/common/Button';
import { FileSpreadsheet, Download, CheckCircle2, TrendingUp, ShieldCheck } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

const AdminReportsPage = () => {
  const { showSuccess } = useToast();

  const handleExportCSV = () => {
    showSuccess('Exporting Lost & Found Master Audit Log (CSV)...');
  };

  return (
    <div className="space-y-6">
      
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Institutional System Reports</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Generate printable audit summaries and export data for campus security reviews.
          </p>
        </div>

        <Button variant="primary" size="md" icon={Download} onClick={handleExportCSV}>
          Export Master Report (CSV)
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-soft space-y-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm">Monthly Recovery Audit</h3>
          <p className="text-xs text-slate-500">Summary of all claims verified and items returned in the past 30 days.</p>
          <Button variant="outline" size="sm" onClick={handleExportCSV} className="w-full">
            Download Audit PDF
          </Button>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-soft space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm">Claim Verification Log</h3>
          <p className="text-xs text-slate-500">Approved vs Rejected claims with claimant student IDs and remarks.</p>
          <Button variant="outline" size="sm" onClick={handleExportCSV} className="w-full">
            Export Claims CSV
          </Button>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-soft space-y-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <TrendingUp className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm">Campus Hotspot Analysis</h3>
          <p className="text-xs text-slate-500">Report breakdown by building venue (Library, Canteen, Gym, Labs).</p>
          <Button variant="outline" size="sm" onClick={handleExportCSV} className="w-full">
            View Location Metrics
          </Button>
        </div>

      </div>

    </div>
  );
};

export default AdminReportsPage;
