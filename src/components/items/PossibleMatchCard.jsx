import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Sparkles, MapPin, Calendar } from 'lucide-react';
import Button from '../common/Button';

const PossibleMatchCard = ({ matchItem, targetItemTitle = 'Lost Item' }) => {
  const matchScore = matchItem.matchScore || 92;

  return (
    <div className="bg-gradient-to-br from-blue-50/50 via-white to-slate-50 border border-blue-200/80 rounded-2xl p-4 sm:p-5 shadow-soft hover:shadow-md transition-all">
      <div className="flex items-center justify-between gap-2 mb-3">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-600 text-white shadow-sm">
          <Sparkles className="w-3.5 h-3.5" />
          {matchScore}% Match
        </span>
        <span className="text-xs text-slate-400 font-medium">Match Recommendation</span>
      </div>

      <div className="flex gap-4 items-start my-3">
        <img
          src={matchItem.image}
          alt={matchItem.title}
          className="w-20 h-20 rounded-xl object-cover border border-slate-200 shrink-0"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&q=80&w=800';
          }}
        />
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-slate-900 text-sm truncate">{matchItem.title}</h4>
          <div className="flex flex-col gap-1 mt-1 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3 text-blue-500" /> {matchItem.location}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3 text-slate-400" /> Found: {matchItem.date}
            </span>
          </div>
        </div>
      </div>

      {/* Match Factor Indicators */}
      <div className="mt-3 pt-3 border-t border-slate-200/60">
        <p className="text-xs font-semibold text-slate-700 mb-2">Matching Factors:</p>
        <div className="grid grid-cols-2 gap-1.5 text-xs text-slate-600">
          <div className="flex items-center gap-1 text-emerald-700 font-medium">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> Category ✓
          </div>
          <div className="flex items-center gap-1 text-emerald-700 font-medium">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> Location ✓
          </div>
          <div className="flex items-center gap-1 text-emerald-700 font-medium">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> Date Match ✓
          </div>
          <div className="flex items-center gap-1 text-emerald-700 font-medium">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> Color Tag ✓
          </div>
        </div>
      </div>

      <div className="mt-4">
        <Link to={`/found-items/${matchItem.id}`}>
          <Button variant="primary" size="sm" className="w-full text-xs">
            View Match Comparison
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default PossibleMatchCard;
