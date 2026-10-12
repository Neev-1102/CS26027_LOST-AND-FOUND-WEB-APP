import React from 'react';
import { Link } from 'react-router-dom';
import { History, Sparkles, ArrowRight, Calendar, ExternalLink } from 'lucide-react';
import AIMatchScore from './AIMatchScore';

const AIMatchHistory = ({ matches = [] }) => {
  if (!matches || matches.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/80 p-8 text-center">
        <History className="w-10 h-10 text-slate-300 mx-auto mb-3" />
        <h4 className="text-sm font-semibold text-slate-700">No match history yet</h4>
        <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
          When you upload lost items or trigger visual scans, comparison records will be saved here.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-soft overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-blue-600" />
          <h3 className="text-sm font-bold text-slate-900">Recent AI Similarity Scans</h3>
        </div>
        <span className="text-xs text-slate-400">{matches.length} scans indexed</span>
      </div>

      <div className="divide-y divide-slate-100">
        {matches.map((match) => (
          <div key={match.id} className="p-4 hover:bg-slate-50/70 transition-colors flex items-center gap-4">
            {/* Thumbnail */}
            <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0 border border-slate-200">
              <img
                src={match.foundItemImage || match.lostItemImage}
                alt={match.foundItemTitle}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=200';
                }}
              />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-900 truncate">
                  {match.foundItemTitle}
                </span>
                <span className="text-[10px] text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full font-medium">
                  {match.category}
                </span>
              </div>
              <p className="text-xs text-slate-500 truncate mt-0.5">
                Matched against: {match.lostItemTitle || 'Uploaded Query Image'}
              </p>
            </div>

            {/* Score */}
            <div className="flex items-center gap-4 flex-shrink-0">
              <AIMatchScore score={match.score} size="sm" showBadge={false} />
              
              <Link
                to={`/ai-matches/${match.id}`}
                className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="View Match Report"
              >
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AIMatchHistory;
