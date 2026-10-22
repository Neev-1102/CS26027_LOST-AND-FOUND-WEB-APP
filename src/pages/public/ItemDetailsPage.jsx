import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import { lostItemService } from '../../services/lostItemService';
import { foundItemService } from '../../services/foundItemService';
import aiMatchService from '../../services/aiMatchService';
import StatusBadge from '../../components/common/StatusBadge';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import ClaimModal from '../../components/items/ClaimModal';
import AIMatchCard from '../../components/ai/AIMatchCard';
import LoadingSkeleton from '../../components/common/LoadingSkeleton';
import ErrorState from '../../components/common/ErrorState';
import { getItemImage } from '../../utils/itemImageHelper';
import {
  MapPin,
  Calendar,
  Clock,
  Tag,
  Palette,
  ShieldCheck,
  Building,
  Mail,
  Lock,
  ArrowLeft,
  Share2,
  Sparkles,
  PhoneCall,
  PlusCircle,
  User,
  ExternalLink,
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { formatDate } from '../../utils/formatters';

const ItemDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const showInfo = toast?.showToast ? (m) => toast.showToast(m, 'info') : toast?.showInfo || console.log;
  const showSuccess = toast?.showToast ? (m) => toast.showToast(m, 'success') : toast?.showSuccess || console.log;

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedGalleryImage, setSelectedGalleryImage] = useState('');

  const [claimModalOpen, setClaimModalOpen] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [possibleMatches, setPossibleMatches] = useState([]);

  const isLostRoute = location.pathname.includes('/lost-items') || id?.startsWith('lost');

  useEffect(() => {
    const fetchItemDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        let fetchedData = null;
        if (isLostRoute) {
          fetchedData = await lostItemService.getById(id);
          const matches = await aiMatchService.findAIMatches(id);
          setPossibleMatches(Array.isArray(matches) ? matches.slice(0, 2) : []);
        } else {
          fetchedData = await foundItemService.getById(id);
        }

        const rawItem = fetchedData?.item || fetchedData;
        if (!rawItem) {
          throw new Error('Item report not found');
        }

        setItem(rawItem);
        const initialImg = getItemImage(rawItem);
        setSelectedGalleryImage(initialImg);
      } catch (err) {
        setError(err.message || 'Item details could not be loaded.');
      } finally {
        setLoading(false);
      }
    };

    fetchItemDetails();
  }, [id, isLostRoute]);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showInfo('Item report link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <LoadingSkeleton type="details" />
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <ErrorState
          title="Item Not Found"
          description={error || 'The requested item report does not exist or was removed.'}
          onRetry={() => navigate(isLostRoute ? '/lost-items' : '/found-items')}
        />
      </div>
    );
  }

  const itemId = item._id || item.id;
  const itemTitle = item.itemName || item.internalItemName || item.title || 'Untitled Item';
  const itemDesc = item.description || item.internalDescription || 'No description provided.';
  const itemLocation = item.locationLost || item.generalLocation || item.location || 'Campus Grounds';
  const itemDate = formatDate(item.dateLost || item.dateFound || item.date);

  const galleryImages = (item.images && item.images.length > 0 && !item.images[0].includes('photo-1553062407-98eeb64c6a62'))
    ? item.images
    : [getItemImage(item)];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-blue-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Directory</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Image & Gallery */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative rounded-3xl overflow-hidden border border-slate-200 bg-white shadow-soft h-96 sm:h-[420px]">
            <img
              src={selectedGalleryImage || galleryImages[0]}
              alt={itemTitle}
              className="w-full h-full object-cover transition-all duration-300"
              onError={(e) => {
                e.target.src = getItemImage(item);
              }}
            />
            <div className="absolute top-4 left-4 z-10">
              <StatusBadge status={item.status} />
            </div>
            <button
              onClick={handleShare}
              className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-white/90 text-slate-700 hover:bg-white hover:text-blue-600 backdrop-blur-md shadow-md transition-all"
              title="Share item report link"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>

          {/* Image Gallery Thumbnails */}
          {galleryImages.length > 1 && (
            <div className="flex items-center gap-3">
              {galleryImages.map((imgUrl, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedGalleryImage(imgUrl)}
                  className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                    selectedGalleryImage === imgUrl ? 'border-blue-600 ring-2 ring-blue-500/20' : 'border-slate-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={imgUrl}
                    alt={`View angle ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Metadata & Actions */}
        <div className="lg:col-span-6 space-y-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-wider">
              <Tag className="w-4 h-4" />
              <span>{item.category || 'General'}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {itemTitle}
            </h1>

            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed whitespace-pre-line">
              {itemDesc}
            </p>
          </div>

          {/* Details Table Card */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-soft space-y-3 text-xs text-slate-700">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="text-slate-400 font-medium flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-600" /> Location
              </span>
              <span className="font-bold text-slate-900">{itemLocation}</span>
            </div>

            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="text-slate-400 font-medium flex items-center gap-2">
                <Calendar className="w-4 h-4 text-slate-400" /> Date Logged
              </span>
              <span className="font-semibold text-slate-800">{itemDate}</span>
            </div>

            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="text-slate-400 font-medium flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-400" /> Approximate Time
              </span>
              <span className="font-semibold text-slate-800">{item.approximateTime || item.time || 'General daytime'}</span>
            </div>

            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="text-slate-400 font-medium flex items-center gap-2">
                <Palette className="w-4 h-4 text-slate-400" /> Color / Finish
              </span>
              <span className="font-semibold text-slate-800">{item.color || 'Unspecified'}</span>
            </div>

            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="text-slate-400 font-medium flex items-center gap-2">
                <Building className="w-4 h-4 text-slate-400" /> Brand / Model
              </span>
              <span className="font-semibold text-slate-800">{item.brand || 'N/A'}</span>
            </div>

            {/* Reporter Information */}
            <div className="flex items-center justify-between pt-1">
              <span className="text-slate-400 font-medium flex items-center gap-2">
                <User className="w-4 h-4 text-slate-400" /> {isLostRoute ? 'Reported By' : 'Custody Officer'}
              </span>
              <span className="font-semibold text-slate-800">
                {item.reportedBy?.name || item.registeredBy?.name || 'Authorized Campus Desk'}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {!isLostRoute ? (
              <Link
                to={`/student/claim/${itemId}`}
                className="py-3 px-4 rounded-xl font-bold text-xs text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition-colors"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Submit Ownership Claim</span>
              </Link>
            ) : (
              <button
                type="button"
                onClick={() => setClaimModalOpen(true)}
                className="py-3 px-4 rounded-xl font-bold text-xs text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition-colors"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Found & Return This</span>
              </button>
            )}

            <Link
              to={`/ai-matches?lostId=${itemId}`}
              className="py-3 px-4 rounded-xl font-bold text-xs text-slate-800 bg-blue-50 hover:bg-blue-100 border border-blue-200 flex items-center justify-center gap-2 transition-colors"
            >
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>Find Possible Matches</span>
            </Link>

            <Link
              to="/student/report-lost"
              className="py-2.5 px-4 rounded-xl font-semibold text-xs text-slate-700 bg-slate-100 hover:bg-slate-200 flex items-center justify-center gap-2 transition-colors"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Report Similar Item</span>
            </Link>

            <button
              type="button"
              onClick={() => setContactModalOpen(true)}
              className="py-2.5 px-4 rounded-xl font-semibold text-xs text-slate-700 bg-slate-100 hover:bg-slate-200 flex items-center justify-center gap-2 transition-colors"
            >
              <Mail className="w-4 h-4" />
              <span>Contact Custody Desk</span>
            </button>
          </div>

          {/* Official Verification Notice */}
          <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200/80 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-blue-900">
              <p className="font-bold">Campus Security Custody Verification</p>
              <p className="text-blue-700 mt-0.5">
                All claims are independently verified before custody transfer. Please have your Student or Institutional ID ready upon claim approval.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Suggested AI Matches Section */}
      {isLostRoute && possibleMatches.length > 0 && (
        <div className="mt-12 pt-8 border-t border-slate-200 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-bold text-slate-900">AI Visual Similarity Matches</h3>
            </div>
            <Link
              to={`/ai-matches?lostId=${itemId}`}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              <span>View all similarity scores</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {possibleMatches.map((m) => (
              <AIMatchCard
                key={m.id || m.foundItem?._id}
                match={m}
                onClaim={() => navigate(`/student/claim/${m.foundItem?._id || m.foundItemId}`)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Claim Submission Modal */}
      <ClaimModal
        isOpen={claimModalOpen}
        onClose={() => setClaimModalOpen(false)}
        item={item}
        onClaimSubmitted={() => {
          showSuccess('Claim submitted successfully! Track review status on your claims dashboard.');
          navigate('/student/my-claims');
        }}
      />

      {/* Contact Privacy Modal */}
      <Modal
        isOpen={contactModalOpen}
        onClose={() => setContactModalOpen(false)}
        title="Campus Property Custody & Inquiries"
        maxWidth="max-w-md"
      >
        <div className="space-y-4 text-xs text-slate-600">
          <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-3">
            <Lock className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Privacy Safeguard</p>
              <p className="mt-0.5 text-amber-800">
                To prevent unsolicited contact, direct personal phone numbers and emails are not publicly revealed. All coordination occurs through official campus desks.
              </p>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <p className="font-bold text-slate-900 text-xs">Official Contact Channels:</p>
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
              <PhoneCall className="w-4 h-4 text-blue-600 flex-shrink-0" />
              <div>
                <p className="font-bold text-slate-800">Campus Security Helpline</p>
                <p className="text-slate-500">+91 99000 88000 (Room 104)</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
              <Building className="w-4 h-4 text-blue-600 flex-shrink-0" />
              <div>
                <p className="font-bold text-slate-800">Lost Property Custody Window</p>
                <p className="text-slate-500">Security Office, Main Administration Hall (Room 104)</p>
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <Button variant="primary" size="sm" onClick={() => setContactModalOpen(false)}>
              Understood
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ItemDetailsPage;
