import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Sparkles, 
  ShieldCheck, 
  MapPin, 
  Calendar, 
  Tag, 
  Info, 
  ExternalLink,
  ShieldAlert,
  Share2
} from 'lucide-react';
import aiMatchService from '../../services/aiMatchService';
import AIMatchScore, { getScoreMetadata } from '../../components/ai/AIMatchScore';
import MatchFactors from '../../components/ai/MatchFactors';
import ImageComparison from '../../components/ai/ImageComparison';
import AIMatchSummary from '../../components/ai/AIMatchSummary';
import ClaimModal from '../../components/items/ClaimModal';
import { useToast } from '../../context/ToastContext';

const AIMatchDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showSuccess } = useToast();

  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [claimModalOpen, setClaimModalOpen] = useState(false);

  useEffect(() => {
    loadMatchDetails();
  }, [id]);

  const loadMatchDetails = async () => {
    try {
      setLoading(true);
      const data = await aiMatchService.getAIMatch(id);
      setMatch(data);
    } catch (err) {
      console.error('Error fetching match details:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs font-semibold text-slate-600">Loading similarity report...</p>
        </div>
      </div>
    );
  }

  if (!match) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center max-w-md">
          <Info className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-slate-800">Match Report Not Found</h2>
          <p className="text-xs text-slate-500 mt-1 mb-4">
            The similarity record you requested does not exist or has expired.
          </p>
          <button
            onClick={() => navigate('/ai-matches')}
            className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold"
          >
            Back to AI Matches
          </button>
        </div>
      </div>
    );
  }

  const meta = getScoreMetadata(match.score);

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Navigation & Actions Topbar */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-mono">Report ID: {match.id}</span>
          </div>
        </div>

        {/* Hero Score Banner */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-soft">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className={`text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${meta.badgeClass}`}>
                  {meta.label} Match
                </span>
                <span className="text-xs text-slate-400">•</span>
                <span className="text-xs font-medium text-slate-500">Confidence: {match.confidenceLevel || 'Very Strong'}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {match.score}% Visual Similarity Match
              </h1>
              <p className="text-xs sm:text-sm text-slate-600">
                Comparing <strong>{match.lostItemTitle || 'Your Lost Item'}</strong> with discovered item <strong>{match.foundItemTitle}</strong>
              </p>
            </div>

            <div className="flex-shrink-0">
              <AIMatchScore score={match.score} size="lg" showBadge={false} />
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="pt-6 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setClaimModalOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-colors"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Claim This Found Item</span>
            </button>

            <Link
              to={`/found-items/${match.foundItemId}`}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              <span>View Found Item Details</span>
            </Link>
          </div>
        </div>

        {/* Visual Image Comparison Section */}
        <ImageComparison
          lostImage={match.lostItemImage}
          foundImage={match.foundItemImage}
          lostTitle={match.lostItemTitle || 'Reported Lost Item'}
          foundTitle={match.foundItemTitle}
          lostMeta={{
            category: match.category,
            location: 'Reported Campus Area',
            date: 'Recent Report'
          }}
          foundMeta={{
            category: match.category,
            location: match.location,
            date: match.dateFound
          }}
        />

        {/* Detailed Breakdown: Factors & Match Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Match Factors Progress Meters */}
          <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-soft">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Similarity Factor Breakdown
              </h2>
            </div>
            <MatchFactors factors={match.factors} />
          </div>

          {/* AI Match Summary & Disclaimer */}
          <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-soft">
            <div className="flex items-center gap-2 mb-4">
              <Info className="w-4 h-4 text-blue-600" />
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Feature Analysis & Verification
              </h2>
            </div>
            <AIMatchSummary
              reasons={match.reasons}
              score={match.score}
              confidenceLevel={match.confidenceLevel}
            />
          </div>
        </div>
      </div>

      {/* Claim Submission Modal */}
      {match && (
        <ClaimModal
          isOpen={claimModalOpen}
          onClose={() => setClaimModalOpen(false)}
          item={{
            id: match.foundItemId,
            title: match.foundItemTitle,
            image: match.foundItemImage,
            location: match.location,
            date: match.dateFound,
            category: match.category
          }}
          onClaimSubmitted={() => {
            showSuccess('Claim submitted successfully! Campus Safety will contact you after review.');
          }}
        />
      )}
    </div>
  );
};

export default AIMatchDetailsPage;
