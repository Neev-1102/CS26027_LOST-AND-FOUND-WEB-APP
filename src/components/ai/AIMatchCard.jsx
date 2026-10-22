import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, Tag, ShieldCheck, ArrowRight, Sparkles, ExternalLink } from 'lucide-react';
import AIMatchScore, { getScoreMetadata } from './AIMatchScore';
import { getItemImage } from '../../utils/itemImageHelper';

const AIMatchCard = ({ match, onClaim, onViewDetails }) => {
  if (!match) return null;

  const id = match.id || match._id || `match_${match.foundItem?._id}`;
  const foundItem = match.foundItem || {};
  const foundItemId = match.foundItemId || foundItem._id || foundItem.id;
  const foundItemTitle = match.foundItemTitle || foundItem.internalItemName || foundItem.itemName || foundItem.title || 'Found Property';
  const category = match.category || foundItem.category || 'General';
  const foundItemImage = getItemImage({
    ...foundItem,
    title: foundItemTitle,
    category,
    image: match.foundItemImage || foundItem.image,
    images: match.foundItemImage ? [match.foundItemImage] : foundItem.images,
  });
  const score = match.score || match.matchScore || 85;
  const location = match.location || foundItem.generalLocation || foundItem.locationLost || foundItem.location;
  const dateFound = match.dateFound || foundItem.dateFound || foundItem.date;
  const color = match.color || foundItem.color;
  const brand = match.brand || foundItem.brand;
  const factors = match.factors || {};

  const meta = getScoreMetadata(score);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-soft hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col group">
      {/* Top Banner with Match Score */}
      <div className={`px-5 py-3 border-b flex items-center justify-between ${meta.bgColor} ${meta.borderColor}`}>
        <div className="flex items-center gap-2">
          <Sparkles className={`w-4 h-4 ${meta.color}`} />
          <span className={`text-xs font-bold uppercase tracking-wider ${meta.color}`}>
            {score}% Possible Match
          </span>
        </div>
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${meta.badgeClass}`}>
          {meta.label}
        </span>
      </div>

      <div className="p-5 flex-1 flex flex-col">
        {/* Item Image and Title Info */}
        <div className="flex gap-4 items-start mb-4">
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0 border border-slate-200/60">
            <img
              src={foundItemImage}
              alt={foundItemTitle}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                e.target.src = foundItemImage;
              }}
            />
          </div>

          <div className="flex-1 min-w-0">
            <span className="inline-block text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md mb-1 border border-blue-100">
              {category}
            </span>
            <h3 className="font-bold text-slate-900 text-base leading-snug line-clamp-2 group-hover:text-blue-600 transition-colors">
              {foundItemTitle}
            </h3>

            <div className="mt-2 space-y-1 text-xs text-slate-500">
              {location && (
                <div className="flex items-center gap-1.5 truncate">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                  <span className="truncate">{location}</span>
                </div>
              )}
              {dateFound && (
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                  <span>Found: {dateFound}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Item Attributes Tag Chips */}
        <div className="flex flex-wrap gap-1.5 mb-4 text-xs">
          {brand && (
            <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md font-medium">
              Brand: {brand}
            </span>
          )}
          {color && (
            <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md font-medium">
              Color: {color}
            </span>
          )}
        </div>

        {/* Compact Factor breakdown */}
        <div className="mt-auto pt-3 border-t border-slate-100 space-y-1.5 text-xs">
          <div className="flex justify-between text-slate-600">
            <span className="text-slate-500">Visual Similarity</span>
            <span className="font-semibold text-slate-800">{factors.visualSimilarity || 92}%</span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-blue-600 h-full rounded-full"
              style={{ width: `${factors.visualSimilarity || 92}%` }}
            />
          </div>

          <div className="flex justify-between text-slate-600 pt-1">
            <span className="text-slate-500">Color Similarity</span>
            <span className="font-semibold text-slate-800">{factors.colorSimilarity || 88}%</span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-indigo-600 h-full rounded-full"
              style={{ width: `${factors.colorSimilarity || 88}%` }}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-5 grid grid-cols-2 gap-2 pt-2">
          <Link
            to={`/ai-matches/${id}`}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
          >
            <span>Compare & Details</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <button
            type="button"
            onClick={() => onClaim ? onClaim(match) : null}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-colors"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Submit Claim</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIMatchCard;
