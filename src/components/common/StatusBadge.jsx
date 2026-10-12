import React from 'react';

const statusConfigs = {
  // Items
  Lost: 'bg-rose-50 text-rose-700 border-rose-200 ring-rose-500/10',
  Found: 'bg-amber-50 text-amber-700 border-amber-200 ring-amber-500/10',
  Claimed: 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-500/10',
  Recovered: 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-500/10',
  
  // Claims
  Pending: 'bg-amber-50 text-amber-700 border-amber-200 ring-amber-500/10',
  'Under Review': 'bg-blue-50 text-blue-700 border-blue-200 ring-blue-500/10',
  Approved: 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-500/10',
  Rejected: 'bg-rose-50 text-rose-700 border-rose-200 ring-rose-500/10',

  // Users
  Active: 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-500/10',
  Blocked: 'bg-slate-100 text-slate-700 border-slate-300 ring-slate-500/10',
};

const StatusBadge = ({ status = 'Lost', size = 'md', className = '' }) => {
  const style = statusConfigs[status] || 'bg-slate-50 text-slate-700 border-slate-200';
  const sizeStyle = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs font-semibold';

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border ring-1 ring-inset ${style} ${sizeStyle} ${className}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current shrink-0"></span>
      {status}
    </span>
  );
};

export default StatusBadge;
