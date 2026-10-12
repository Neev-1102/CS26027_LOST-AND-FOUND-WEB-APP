import React from 'react';
import { Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';

/**
 * AIMatchScore Component
 * 
 * Rules:
 * - 90–100: Very Strong
 * - 80–89: Strong
 * - 70–79: Moderate
 * - 60–69: Possible
 * - Below 60: Low
 * - Never use "Confirmed"
 */

export const getScoreMetadata = (score) => {
  if (score >= 90) {
    return {
      label: 'Very Strong',
      subtitle: 'High visual & contextual correlation',
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200',
      ringColor: '#10b981',
      badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200'
    };
  }
  if (score >= 80) {
    return {
      label: 'Strong',
      subtitle: 'Notable similarity detected',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      ringColor: '#2563eb',
      badgeClass: 'bg-blue-100 text-blue-800 border-blue-200'
    };
  }
  if (score >= 70) {
    return {
      label: 'Moderate',
      subtitle: 'Partial feature matches found',
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200',
      ringColor: '#f59e0b',
      badgeClass: 'bg-amber-100 text-amber-800 border-amber-200'
    };
  }
  if (score >= 60) {
    return {
      label: 'Possible',
      subtitle: 'General category or color likeness',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      ringColor: '#ea580c',
      badgeClass: 'bg-orange-100 text-orange-800 border-orange-200'
    };
  }
  return {
    label: 'Low',
    subtitle: 'Limited visual overlap',
    color: 'text-slate-600',
    bgColor: 'bg-slate-50',
    borderColor: 'border-slate-200',
    ringColor: '#64748b',
    badgeClass: 'bg-slate-100 text-slate-700 border-slate-200'
  };
};

const AIMatchScore = ({ score = 0, size = 'md', showBadge = true, variant = 'ring' }) => {
  const meta = getScoreMetadata(score);

  if (variant === 'badge') {
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${meta.badgeClass}`}>
        <Sparkles className="w-3.5 h-3.5" />
        <span>{score}% Possible Match</span>
      </span>
    );
  }

  // Circular gauge calculations
  const radius = size === 'lg' ? 44 : size === 'sm' ? 24 : 32;
  const strokeWidth = size === 'lg' ? 6 : size === 'sm' ? 4 : 5;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const dimension = (radius + strokeWidth) * 2;

  return (
    <div className="flex items-center gap-3">
      <div className="relative inline-flex items-center justify-center flex-shrink-0" style={{ width: dimension, height: dimension }}>
        <svg className="transform -rotate-90" width={dimension} height={dimension}>
          {/* Background circle */}
          <circle
            cx={dimension / 2}
            cy={dimension / 2}
            r={radius}
            stroke="#e2e8f0"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Progress circle */}
          <circle
            cx={dimension / 2}
            cy={dimension / 2}
            r={radius}
            stroke={meta.ringColor}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Center score */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className={`font-bold tracking-tight ${size === 'lg' ? 'text-2xl' : size === 'sm' ? 'text-xs' : 'text-base'} text-slate-900`}>
            {score}%
          </span>
        </div>
      </div>

      {showBadge && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className={`text-xs font-semibold uppercase tracking-wider px-2 py-0.5 rounded border ${meta.badgeClass}`}>
              {meta.label} Match
            </span>
          </div>
          <span className="text-xs text-slate-500 mt-0.5">{meta.subtitle}</span>
        </div>
      )}
    </div>
  );
};

export default AIMatchScore;
