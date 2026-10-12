import React, { useState } from 'react';
import { Sparkles, Maximize2, Tag, Calendar, MapPin } from 'lucide-react';

const ImageComparison = ({
  lostImage,
  foundImage,
  lostTitle = 'Your Reported Item',
  foundTitle = 'Possible Found Match',
  lostMeta = {},
  foundMeta = {},
  className = ''
}) => {
  const [activeView, setActiveView] = useState('both'); // 'both', 'lost', 'found'

  return (
    <div className={`bg-white rounded-2xl border border-slate-200/80 shadow-soft overflow-hidden ${className}`}>
      {/* Header bar with controls */}
      <div className="px-5 py-3.5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-slate-50/70">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-blue-600" />
          <h3 className="text-sm font-semibold text-slate-800">Visual Image Comparison</h3>
        </div>

        {/* View switcher tabs */}
        <div className="flex items-center bg-slate-200/70 p-0.5 rounded-lg text-xs font-medium text-slate-600">
          <button
            type="button"
            onClick={() => setActiveView('both')}
            className={`px-2.5 py-1 rounded-md transition-all ${
              activeView === 'both' ? 'bg-white text-blue-600 shadow-xs font-semibold' : 'hover:text-slate-900'
            }`}
          >
            Side by Side
          </button>
          <button
            type="button"
            onClick={() => setActiveView('lost')}
            className={`px-2.5 py-1 rounded-md transition-all ${
              activeView === 'lost' ? 'bg-white text-blue-600 shadow-xs font-semibold' : 'hover:text-slate-900'
            }`}
          >
            Lost Item Only
          </button>
          <button
            type="button"
            onClick={() => setActiveView('found')}
            className={`px-2.5 py-1 rounded-md transition-all ${
              activeView === 'found' ? 'bg-white text-blue-600 shadow-xs font-semibold' : 'hover:text-slate-900'
            }`}
          >
            Found Item Only
          </button>
        </div>
      </div>

      {/* Images container: stacks vertically on mobile, side-by-side on md+ */}
      <div className="p-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          {/* Lost Item Card */}
          {(activeView === 'both' || activeView === 'lost') && (
            <div className={`flex flex-col rounded-xl border border-rose-100 bg-rose-50/20 overflow-hidden ${activeView === 'lost' ? 'md:col-span-2 max-w-xl mx-auto' : ''}`}>
              <div className="px-4 py-2.5 bg-rose-50 border-b border-rose-100 flex items-center justify-between">
                <span className="text-xs font-bold text-rose-700 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                  Your Lost Item
                </span>
                {lostMeta.category && (
                  <span className="text-xs text-rose-600 font-medium bg-white/80 px-2 py-0.5 rounded-full border border-rose-200">
                    {lostMeta.category}
                  </span>
                )}
              </div>

              <div className="relative aspect-4/3 w-full bg-slate-900/5 overflow-hidden flex items-center justify-center">
                <img
                  src={lostImage || 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=800'}
                  alt={lostTitle}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=800';
                  }}
                />
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between bg-white">
                <div>
                  <h4 className="font-semibold text-slate-900 text-sm">{lostTitle}</h4>
                  {lostMeta.location && (
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{lostMeta.location}</span>
                    </div>
                  )}
                </div>
                {lostMeta.date && (
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-2 pt-2 border-t border-slate-100">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Reported on {lostMeta.date}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Found Item Card */}
          {(activeView === 'both' || activeView === 'found') && (
            <div className={`flex flex-col rounded-xl border border-emerald-100 bg-emerald-50/20 overflow-hidden ${activeView === 'found' ? 'md:col-span-2 max-w-xl mx-auto' : ''}`}>
              <div className="px-4 py-2.5 bg-emerald-50 border-b border-emerald-100 flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  Possible Found Item
                </span>
                {foundMeta.category && (
                  <span className="text-xs text-emerald-600 font-medium bg-white/80 px-2 py-0.5 rounded-full border border-emerald-200">
                    {foundMeta.category}
                  </span>
                )}
              </div>

              <div className="relative aspect-4/3 w-full bg-slate-900/5 overflow-hidden flex items-center justify-center">
                <img
                  src={foundImage || 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=800'}
                  alt={foundTitle}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=800';
                  }}
                />
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between bg-white">
                <div>
                  <h4 className="font-semibold text-slate-900 text-sm">{foundTitle}</h4>
                  {foundMeta.location && (
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>Found at {foundMeta.location}</span>
                    </div>
                  )}
                </div>
                {foundMeta.date && (
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-2 pt-2 border-t border-slate-100">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Discovered on {foundMeta.date}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageComparison;
