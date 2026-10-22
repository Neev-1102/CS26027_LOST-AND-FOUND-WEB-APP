import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, ArrowRight, Tag } from 'lucide-react';
import StatusBadge from '../common/StatusBadge';
import { formatDate } from '../../utils/formatters';
import { getItemImage } from '../../utils/itemImageHelper';

const ItemCard = ({ item, type = 'lost', claimable = false }) => {
  const isLost = type === 'lost' || item?.type === 'lost' || (item?.status && item.status.toLowerCase().includes('lost'));
  const itemId = item?._id || item?.id;
  const itemTitle = item?.itemName || item?.internalItemName || item?.title || 'Untitled Item';
  const itemDesc = item?.description || item?.internalDescription || 'No description provided.';
  const itemLocation = item?.locationLost || item?.generalLocation || item?.location || 'Campus';
  const itemDate = item?.dateLost || item?.dateFound || item?.date;
  const itemImg = getItemImage(item);

  const detailLink = claimable
    ? `/student/claim/${itemId}`
    : isLost
    ? `/lost-items/${itemId}`
    : `/found-items/${itemId}`;

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between h-full">
      <div>
        {/* Image thumbnail container */}
        <div className="relative h-48 w-full overflow-hidden bg-slate-100">
          <img
            src={itemImg}
            alt={itemTitle}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              e.target.src = getItemImage({ ...item, images: [] });
            }}
          />
          {/* Status badge floating top right */}
          <div className="absolute top-3 right-3 z-10">
            <StatusBadge status={item.status} />
          </div>
          {/* Category tag bottom left */}
          <div className="absolute bottom-3 left-3 z-10 bg-slate-900/70 text-white text-xs px-2.5 py-1 rounded-lg backdrop-blur-md flex items-center gap-1 font-medium">
            <Tag className="w-3 h-3 text-blue-400" />
            <span>{item.category || 'General'}</span>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-4 sm:p-5">
          <h3 className="font-bold text-slate-900 text-base line-clamp-1 group-hover:text-blue-600 transition-colors">
            {itemTitle}
          </h3>

          <p className="text-xs text-slate-500 line-clamp-2 mt-1.5 leading-relaxed">
            {itemDesc}
          </p>

          <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col gap-2 text-xs text-slate-600">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span className="truncate font-medium">{itemLocation}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>{isLost ? 'Lost on' : 'Found on'}: {formatDate(itemDate)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Card Footer */}
      <div className="p-4 sm:p-5 pt-0">
        <Link
          to={detailLink}
          className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold bg-slate-50 text-slate-700 hover:bg-blue-600 hover:text-white transition-all group/btn"
        >
          <span>{claimable ? 'Submit Claim' : 'View Full Details'}</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
};

export default ItemCard;
