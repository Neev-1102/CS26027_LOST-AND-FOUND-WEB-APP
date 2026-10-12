import React from 'react';
import { CheckCircle2, Clock, HelpCircle, XCircle, ArrowRight } from 'lucide-react';
import { STATUS_LABELS, STATUS_COLORS } from '../../utils/constants';

const ClaimStatus = ({ status = 'pending', showTimeline = false }) => {
  const normalized = status.toLowerCase();
  const label = STATUS_LABELS[normalized] || status;
  const color = STATUS_COLORS[normalized] || 'bg-slate-100 text-slate-700 border-slate-200';

  const steps = [
    { key: 'pending', label: 'Submitted' },
    { key: 'under_review', label: 'Under Review' },
    { key: 'approved', label: 'Approved' },
    { key: 'completed', label: 'Handover Completed' },
  ];

  const getStepIndex = (st) => {
    switch (st) {
      case 'pending': return 0;
      case 'under_review':
      case 'additional_information_requested': return 1;
      case 'approved': return 2;
      case 'completed': return 3;
      default: return -1;
    }
  };

  const currentStep = getStepIndex(normalized);

  return (
    <div>
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${color}`}>
        {normalized === 'completed' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
        {normalized === 'approved' && <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />}
        {normalized === 'under_review' && <Clock className="w-3.5 h-3.5 text-blue-600" />}
        {normalized === 'additional_information_requested' && <HelpCircle className="w-3.5 h-3.5 text-purple-600" />}
        {normalized === 'rejected' && <XCircle className="w-3.5 h-3.5 text-rose-600" />}
        <span>{label}</span>
      </span>

      {showTimeline && normalized !== 'rejected' && (
        <div className="mt-4 pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between">
            {steps.map((s, idx) => {
              const isPassed = idx <= currentStep;
              const isCurrent = idx === currentStep;
              return (
                <div key={s.key} className="flex-1 flex flex-col items-center relative">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                      isPassed
                        ? 'bg-blue-600 text-white ring-4 ring-blue-100'
                        : 'bg-slate-100 text-slate-400 border border-slate-200'
                    }`}
                  >
                    {idx + 1}
                  </div>
                  <span
                    className={`mt-1.5 text-[11px] font-semibold text-center ${
                      isCurrent ? 'text-blue-600 font-bold' : isPassed ? 'text-slate-700' : 'text-slate-400'
                    }`}
                  >
                    {s.label}
                  </span>
                  {idx < steps.length - 1 && (
                    <div
                      className={`absolute top-3.5 left-1/2 w-full h-0.5 -z-10 ${
                        idx < currentStep ? 'bg-blue-600' : 'bg-slate-200'
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ClaimStatus;
