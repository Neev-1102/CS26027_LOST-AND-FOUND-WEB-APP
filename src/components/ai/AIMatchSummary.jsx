import React from 'react';
import { CheckCircle2, ShieldAlert, Sparkles, HelpCircle } from 'lucide-react';

const AIMatchSummary = ({
  reasons = [],
  score = 90,
  confidenceLevel = 'Very Strong',
  className = ''
}) => {
  const defaultReasons = reasons.length > 0 ? reasons : [
    'Same category and taxonomic classification',
    'Similar exterior color palette and material texture',
    'Corresponding silhouette and physical dimensions',
    'Found near the reported campus location',
    'Discovered within an immediate temporal range of the loss report'
  ];

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Why this may be a match container */}
      <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-blue-600" />
          <h4 className="text-sm font-semibold text-slate-800">Why this may be a match:</h4>
        </div>

        <ul className="space-y-2">
          {defaultReasons.map((reason, idx) => (
            <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span>{reason}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Mandatory verification disclaimer */}
      <div className="bg-amber-50/80 border border-amber-200/90 rounded-xl p-3.5 flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div className="text-xs text-amber-800 space-y-1">
          <p className="font-semibold text-amber-900">
            Important Ownership & Verification Notice
          </p>
          <p>
            AI matches are automated suggestions based on visual feature vectors and contextual metadata. They do not constitute proof of ownership. All claims must be verified by Campus Safety personnel with valid proof.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AIMatchSummary;
