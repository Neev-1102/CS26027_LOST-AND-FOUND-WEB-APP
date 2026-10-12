import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  Sparkles, 
  UploadCloud, 
  Search, 
  Filter, 
  SlidersHorizontal, 
  AlertTriangle, 
  ShieldAlert, 
  History, 
  ArrowRight,
  FileQuestion,
  RefreshCw
} from 'lucide-react';
import aiMatchService from '../../services/aiMatchService';
import { lostItemService } from '../../services/lostItemService';
import AIMatchCard from '../../components/ai/AIMatchCard';
import AIAnalysisLoader from '../../components/ai/AIAnalysisLoader';
import ImageUploader from '../../components/common/ImageUploader';
import ClaimModal from '../../components/items/ClaimModal';
import { useToast } from '../../context/ToastContext';
import AIMatchHistory from '../../components/ai/AIMatchHistory';

const AIMatchesPage = () => {
  const [searchParams] = useSearchParams();
  const preselectedLostId = searchParams.get('lostId');
  const { showSuccess, showError } = useToast();

  const [matches, setMatches] = useState([]);
  const [userLostItems, setUserLostItems] = useState([]);
  const [selectedLostItem, setSelectedLostItem] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [hasScanned, setHasScanned] = useState(false);
  const [loadingInitial, setLoadingInitial] = useState(true);

  // Filters & Tabs
  const [activeTab, setActiveTab] = useState('scan'); // 'scan', 'history'
  const [minScore, setMinScore] = useState(60);
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Claim modal state
  const [claimModalOpen, setClaimModalOpen] = useState(false);
  const [itemToClaim, setItemToClaim] = useState(null);

  useEffect(() => {
    loadData();
  }, [preselectedLostId]);

  const loadData = async () => {
    try {
      setLoadingInitial(true);
      const [lostResult, allMatches] = await Promise.all([
        lostItemService.getAll(),
        aiMatchService.getMatchHistory()
      ]);

      setUserLostItems(lostResult.items || []);
      setMatches(allMatches || []);

      if (preselectedLostId) {
        const found = (lostResult.items || []).find((i) => i.id === preselectedLostId);
        if (found) {
          setSelectedLostItem(found);
          setUploadedImage(found.image);
          // Auto start analysis if navigated from lost item details
          setIsAnalyzing(true);
        }
      }
    } catch (err) {
      console.error('Error loading AI matching data:', err);
    } finally {
      setLoadingInitial(false);
    }
  };

  const handleStartAnalysis = () => {
    if (!uploadedImage && !selectedLostItem) {
      showError('Please upload an image or select a reported lost item first.');
      return;
    }
    setIsAnalyzing(true);
  };

  const handleAnalysisComplete = async () => {
    setIsAnalyzing(false);
    setHasScanned(true);

    const relevant = await aiMatchService.findAIMatches(selectedLostItem?.id);
    setMatches(relevant);
    showSuccess('AI similarity search complete! Review suggested items below.');
  };

  const handleSelectPredefinedLost = (itemId) => {
    if (!itemId) {
      setSelectedLostItem(null);
      setUploadedImage(null);
      return;
    }
    const item = userLostItems.find((i) => i.id === itemId);
    if (item) {
      setSelectedLostItem(item);
      setUploadedImage(item.image);
    }
  };

  const handleClaim = (match) => {
    // Construct found item format for ClaimModal
    setItemToClaim({
      id: match.foundItemId,
      title: match.foundItemTitle,
      image: match.foundItemImage,
      location: match.location,
      date: match.dateFound,
      category: match.category
    });
    setClaimModalOpen(true);
  };

  // Filter matches
  const filteredMatches = matches.filter((m) => {
    const matchCategory = selectedCategory === 'all' || m.category?.toLowerCase() === selectedCategory.toLowerCase();
    const matchScore = (m.score || 0) >= minScore;
    return matchCategory && matchScore;
  });

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-soft">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI Computer Vision Engine</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                AI Possible Matches
              </h1>
              <p className="text-slate-600 text-sm leading-relaxed">
                Upload a photo of your lost belonging or choose from your reported items. Our similarity engine extracts visual feature vectors, colors, and contours to identify potential found items on campus.
              </p>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl self-start lg:self-center">
              <button
                type="button"
                onClick={() => setActiveTab('scan')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'scan' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Visual Matcher</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('history')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'history' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <History className="w-3.5 h-3.5" />
                <span>Scan History</span>
              </button>
            </div>
          </div>

          {/* Mandatory Regulatory Disclaimer */}
          <div className="mt-6 p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-amber-900">
              <span className="font-bold">Important Notice: </span>
              AI matches are suggestions only and are not proof of ownership. All claims are independently reviewed by campus safety officers before custody transfer.
            </div>
          </div>
        </div>

        {activeTab === 'history' ? (
          <AIMatchHistory matches={matches} />
        ) : (
          <>
            {/* Input & Upload Stage */}
            {!isAnalyzing && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Upload or Choose Item Card */}
                <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-soft space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <div>
                      <h2 className="text-base font-bold text-slate-900">
                        1. Provide Lost Item Image
                      </h2>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Upload a photo or pick an existing lost report from your history
                      </p>
                    </div>

                    {uploadedImage && (
                      <button
                        type="button"
                        onClick={() => {
                          setUploadedImage(null);
                          setSelectedLostItem(null);
                        }}
                        className="text-xs font-semibold text-rose-600 hover:text-rose-700"
                      >
                        Clear Image
                      </button>
                    )}
                  </div>

                  {/* Pick from existing reports dropdown */}
                  {userLostItems.length > 0 && (
                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-slate-700">
                        Quick Select From Existing Lost Reports:
                      </label>
                      <select
                        value={selectedLostItem?.id || ''}
                        onChange={(e) => handleSelectPredefinedLost(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      >
                        <option value="">-- Or upload a new image below --</option>
                        {userLostItems.map((item) => (
                          <option key={item.id} value={item.id}>
                            {item.title} ({item.category} • {item.location})
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Image Uploader */}
                  <ImageUploader
                    value={uploadedImage}
                    onChange={(url) => setUploadedImage(url)}
                    label="Item Photo for Visual Search"
                  />

                  {/* Find Matches Action Button */}
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={handleStartAnalysis}
                      disabled={!uploadedImage}
                      className="w-full py-3.5 px-6 rounded-xl font-bold text-sm text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-blue-500/10 flex items-center justify-center gap-2 transition-all"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>Find Possible Matches</span>
                    </button>
                  </div>
                </div>

                {/* Engine Explanation Card */}
                <div className="lg:col-span-5 flex flex-col gap-6">
                  <div className="bg-gradient-to-br from-slate-900 to-blue-950 text-white rounded-3xl p-6 sm:p-8 shadow-soft space-y-5">
                    <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-blue-400">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">How CampusFind AI Works</h3>
                      <p className="text-slate-300 text-xs mt-1.5 leading-relaxed">
                        Our computer vision simulation evaluates items on campus across 5 weighted dimensions:
                      </p>
                    </div>

                    <div className="space-y-3 pt-2 text-xs">
                      <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white/5 border border-white/10">
                        <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                        <span className="text-slate-200"><strong>Visual Feature Vectors:</strong> Edge and surface patterns</span>
                      </div>
                      <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white/5 border border-white/10">
                        <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
                        <span className="text-slate-200"><strong>Color Spectrum:</strong> Primary & secondary color balance</span>
                      </div>
                      <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white/5 border border-white/10">
                        <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                        <span className="text-slate-200"><strong>Classification:</strong> Model & brand attributes</span>
                      </div>
                      <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white/5 border border-white/10">
                        <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                        <span className="text-slate-200"><strong>Campus Proximity:</strong> Discovery location relative to loss zone</span>
                      </div>
                    </div>
                  </div>

                  {/* Quick Tip */}
                  <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-soft text-xs text-slate-600 space-y-2">
                    <p className="font-bold text-slate-800">Tip for Best Results:</p>
                    <p>
                      Clear photos in well-lit conditions with distinctive markings, stickers, or logos yield higher match confidence scores.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Analysis In Progress Simulation */}
            {isAnalyzing && (
              <div className="py-12">
                <AIAnalysisLoader onComplete={handleAnalysisComplete} durationMs={3200} />
              </div>
            )}

            {/* Results Grid */}
            {!isAnalyzing && (hasScanned || matches.length > 0) && (
              <div className="space-y-6 pt-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                      <span>Possible Matches Found</span>
                      <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-xs font-bold">
                        {filteredMatches.length} items
                      </span>
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">
                      Ranked by composite AI similarity score. Click Compare & Details to inspect factor breakdown.
                    </p>
                  </div>

                  {/* Filter controls */}
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-slate-500 font-medium">Min Score:</span>
                      <select
                        value={minScore}
                        onChange={(e) => setMinScore(Number(e.target.value))}
                        className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-800"
                      >
                        <option value={60}>60%+ (Possible)</option>
                        <option value={70}>70%+ (Moderate)</option>
                        <option value={80}>80%+ (Strong)</option>
                        <option value={90}>90%+ (Very Strong)</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-slate-500 font-medium">Category:</span>
                      <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-800"
                      >
                        <option value="all">All Categories</option>
                        <option value="Electronics">Electronics</option>
                        <option value="Accessories">Accessories</option>
                        <option value="Bags & Backpacks">Bags & Backpacks</option>
                        <option value="ID Cards">ID Cards</option>
                        <option value="Keys & Fobs">Keys & Fobs</option>
                        <option value="Clothing">Clothing</option>
                      </select>
                    </div>

                    <button
                      type="button"
                      onClick={handleStartAnalysis}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-semibold transition-colors"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Rescan</span>
                    </button>
                  </div>
                </div>

                {filteredMatches.length === 0 ? (
                  <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center max-w-lg mx-auto">
                    <FileQuestion className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <h3 className="text-base font-bold text-slate-800">No matches above {minScore}% score</h3>
                    <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                      Try lowering the minimum score threshold or broaden the category filter to review candidate items.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setMinScore(60);
                        setSelectedCategory('all');
                      }}
                      className="mt-4 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold transition-colors"
                    >
                      Reset Filters
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredMatches.map((match) => (
                      <AIMatchCard
                        key={match.id}
                        match={match}
                        onClaim={handleClaim}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* Claim Submission Modal */}
      {itemToClaim && (
        <ClaimModal
          isOpen={claimModalOpen}
          onClose={() => {
            setClaimModalOpen(false);
            setItemToClaim(null);
          }}
          item={itemToClaim}
          onClaimSubmitted={() => {
            showSuccess('Claim submitted successfully! Campus Safety will review your details.');
          }}
        />
      )}
    </div>
  );
};

export default AIMatchesPage;
