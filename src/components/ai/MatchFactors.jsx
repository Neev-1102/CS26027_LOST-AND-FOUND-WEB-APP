import React from 'react';
import { Eye, Palette, Layers, MapPin, Calendar } from 'lucide-react';

const MatchFactors = ({ factors = {}, className = '' }) => {
  const defaultFactors = {
    visualSimilarity: factors.visualSimilarity ?? 90,
    colorSimilarity: factors.colorSimilarity ?? 88,
    categoryMatch: factors.categoryMatch ?? 100,
    locationSimilarity: factors.locationSimilarity ?? 84,
    dateSimilarity: factors.dateSimilarity ?? 86,
  };

  const factorItems = [
    {
      key: 'visualSimilarity',
      label: 'Visual Similarity',
      value: defaultFactors.visualSimilarity,
      icon: Eye,
      color: 'bg-blue-600',
      description: 'Pattern, shape, contour and visual feature vector comparison'
    },
    {
      key: 'colorSimilarity',
      label: 'Color Similarity',
      value: defaultFactors.colorSimilarity,
      icon: Palette,
      color: 'bg-indigo-600',
      description: 'Dominant color palette and tone distribution analysis'
    },
    {
      key: 'categoryMatch',
      label: 'Category Match',
      value: defaultFactors.categoryMatch,
      icon: Layers,
      color: 'bg-emerald-600',
      description: 'Object taxonomic classification match'
    },
    {
      key: 'locationSimilarity',
      label: 'Location Proximity',
      value: defaultFactors.locationSimilarity,
      icon: MapPin,
      color: 'bg-amber-600',
      description: 'Campus geofence and building correlation distance'
    },
    {
      key: 'dateSimilarity',
      label: 'Date Proximity',
      value: defaultFactors.dateSimilarity,
      icon: Calendar,
      color: 'bg-purple-600',
      description: 'Temporal closeness between loss report and hand-in timestamp'
    },
  ];

  return (
    <div className={`space-y-3.5 ${className}`}>
      <div className="flex items-center justify-between pb-1 border-b border-slate-100">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Similarity Factor</span>
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Weight / Score</span>
      </div>

      {factorItems.map((factor) => {
        const Icon = factor.icon;
        return (
          <div key={factor.key} className="group">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-medium text-slate-700 flex items-center gap-1.5">
                <Icon className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 transition-colors" />
                {factor.label}
              </span>
              <span className="font-bold text-slate-900">{factor.value}%</span>
            </div>

            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div
                className={`h-full ${factor.color} rounded-full transition-all duration-700 ease-out`}
                style={{ width: `${factor.value}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MatchFactors;
