import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { foundItemService } from '../../services/foundItemService';
import ClaimForm from '../../components/claims/ClaimForm';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { ArrowLeft, ShieldCheck, MapPin, Calendar, Tag } from 'lucide-react';
import { formatDate } from '../../utils/formatters';

const SubmitClaimPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        setLoading(true);
        const res = await foundItemService.getById(id);
        setItem(res.item || null);
      } catch (err) {
        console.error('Failed to fetch item details:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchItem();
  }, [id]);

  if (loading) {
    return <LoadingSpinner size="lg" message="Loading item details for claim..." />;
  }

  if (!item) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center max-w-md mx-auto">
        <h2 className="text-lg font-bold text-slate-800">Item Not Found</h2>
        <p className="text-xs text-slate-500 mt-1 mb-4">The item you are attempting to claim is not available.</p>
        <button
          onClick={() => navigate('/student/available-claims')}
          className="text-xs font-bold text-blue-600 hover:underline"
        >
          Return to Available Claims
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to listings
      </button>

      {/* Item Summary Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col sm:flex-row gap-5 items-start">
        <img
          src={item.images?.[0] || item.image || 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&q=80&w=800'}
          alt={item.internalItemName || item.title}
          className="w-full sm:w-36 h-36 rounded-2xl object-cover border border-slate-100 shrink-0"
        />
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 flex items-center gap-1">
              <Tag className="w-3 h-3" /> {item.category}
            </span>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              In Campus Custody
            </span>
          </div>
          <h2 className="text-xl font-black text-slate-900">{item.internalItemName || item.title}</h2>
          <p className="text-xs text-slate-500 line-clamp-2">{item.internalDescription || item.description}</p>
          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 pt-2 border-t border-slate-100">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-blue-600" /> {item.generalLocation || item.location}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" /> Found on {formatDate(item.dateFound || item.date)}
            </span>
          </div>
        </div>
      </div>

      {/* Claim Form Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900 mb-1">Submit Proof of Ownership</h3>
        <p className="text-xs text-slate-500 mb-6">
          Provide identifying evidence that only the genuine owner would know.
        </p>
        <ClaimForm
          foundItem={item}
          onSuccess={() => navigate('/student/my-claims')}
          onCancel={() => navigate(-1)}
        />
      </div>
    </div>
  );
};

export default SubmitClaimPage;
