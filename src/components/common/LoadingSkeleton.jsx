import React from 'react';

const LoadingSkeleton = ({ type = 'card', count = 4 }) => {
  if (type === 'card') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: count }).map((_, idx) => (
          <div key={idx} className="bg-white rounded-2xl border border-slate-100 overflow-hidden p-4 animate-pulse shadow-soft">
            <div className="w-full h-44 bg-slate-200 rounded-xl mb-4"></div>
            <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-slate-200 rounded w-1/2 mb-4"></div>
            <div className="flex justify-between items-center pt-3 border-t border-slate-100">
              <div className="h-3 bg-slate-200 rounded w-1/3"></div>
              <div className="h-6 bg-slate-200 rounded-full w-16"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 animate-pulse">
      <div className="h-6 bg-slate-200 rounded w-1/4 mb-4"></div>
      <div className="h-4 bg-slate-200 rounded w-full mb-2"></div>
      <div className="h-4 bg-slate-200 rounded w-5/6 mb-4"></div>
      <div className="h-32 bg-slate-200 rounded-xl w-full"></div>
    </div>
  );
};

export default LoadingSkeleton;
