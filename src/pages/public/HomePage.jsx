import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  PlusCircle,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Laptop,
  CreditCard,
  BookOpen,
  ShoppingBag,
  Key,
  Watch,
  Shirt,
  FileText,
  Box,
  CheckCircle2,
  Lock,
  UserCheck,
  TrendingUp,
  FileQuestion,
  HelpCircle,
  ScanSearch,
  ExternalLink
} from 'lucide-react';
import Button from '../../components/common/Button';
import ItemCard from '../../components/items/ItemCard';
import { CATEGORIES } from '../../data/mockData';
import { lostItemService } from '../../services/lostItemService';
import { foundItemService } from '../../services/foundItemService';

const iconMap = {
  Laptop,
  CreditCard,
  BookOpen,
  ShoppingBag,
  Key,
  Watch,
  Shirt,
  FileText,
  Box
};

const HOW_IT_WORKS_STEPS = [
  {
    step: '01',
    title: 'Report',
    description: 'Submit an online report with item photo, campus location, and identifying details.'
  },
  {
    step: '02',
    title: 'Search',
    description: 'Browse the centralized real-time lost and found directories by category or building.'
  },
  {
    step: '03',
    title: 'Match',
    description: 'Our AI visual similarity engine detects and ranks potential match candidates.'
  },
  {
    step: '04',
    title: 'Claim',
    description: 'Submit ownership evidence, serials, or secret features for officer review.'
  },
  {
    step: '05',
    title: 'Return',
    description: 'Safely retrieve your belonging at the campus safety office custody window.'
  }
];

const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [lostItems, setLostItems] = useState([]);
  const [foundItems, setFoundItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [lostRes, foundRes] = await Promise.all([
          lostItemService.getAll(),
          foundItemService.getAll()
        ]);
        setLostItems((lostRes.items || []).slice(0, 4));
        setFoundItems((foundRes.items || []).slice(0, 4));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleHeroSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/lost-items?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="space-y-16 pb-20">
      
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/70 via-white to-slate-50 pt-14 pb-20 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100/80 text-blue-700 text-xs font-bold tracking-wide uppercase shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                Campus Lost & Found Platform
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight">
                Lost something <br className="hidden sm:inline" />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700">
                  on campus?
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-2xl leading-relaxed mx-auto lg:mx-0">
                CampusFind helps students and staff report, search, and recover lost belongings.
              </p>

              {/* Action Buttons as requested in Section 8 */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
                <Link to="/report/lost" className="w-full sm:w-auto">
                  <Button variant="primary" size="lg" icon={PlusCircle} className="w-full sm:w-auto shadow-lg shadow-blue-500/20">
                    Report Lost Item
                  </Button>
                </Link>
                <Link to="/report/found" className="w-full sm:w-auto">
                  <Button variant="secondary" size="lg" icon={CheckCircle2} className="w-full sm:w-auto">
                    Report Found Item
                  </Button>
                </Link>
                <Link to="/lost-items" className="w-full sm:w-auto">
                  <Button variant="outline" size="lg" icon={Search} className="w-full sm:w-auto">
                    Browse Items
                  </Button>
                </Link>
              </div>

              {/* Quick Hero Search Input */}
              <form onSubmit={handleHeroSearch} className="mt-8 max-w-xl mx-auto lg:mx-0">
                <div className="relative flex items-center shadow-lg rounded-2xl overflow-hidden border border-slate-200 bg-white focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
                  <Search className="w-5 h-5 absolute left-4 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search backpacks, phones, student ID cards, keys..."
                    className="w-full pl-12 pr-28 py-3.5 text-xs sm:text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="absolute right-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-xs transition-all flex items-center gap-1.5"
                  >
                    <span>Search</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            </div>

            {/* Hero Visual Card */}
            <div className="lg:col-span-5 relative flex justify-center">
              <div className="relative w-full max-w-md aspect-4/3 sm:aspect-square rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-900/5 group">
                <img
                  src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=800"
                  alt="CampusFind Student Campus"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent"></div>
                
                {/* Floating AI Highlight Badge */}
                <div className="absolute top-4 left-4 p-3 rounded-2xl bg-white/95 backdrop-blur-md border border-white/60 shadow-lg flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-blue-600 tracking-wider">AI Powered</span>
                    <h5 className="font-bold text-slate-900 text-xs">Visual Similarity Matcher</h5>
                  </div>
                </div>

                {/* Floating Stat Chip */}
                <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-white/40 shadow-xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
                      <TrendingUp className="w-5 h-5" />
                    </div>
                    <div>
                      <h5 className="font-bold text-slate-900 text-sm">720+ Items Returned</h5>
                      <p className="text-xs text-slate-500">94% average claim verification rate</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. Mock Statistics Section (Section 8) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-soft text-center space-y-1">
            <h3 className="text-3xl sm:text-4xl font-black text-rose-600 tracking-tight">1,250+</h3>
            <p className="text-xs sm:text-sm font-semibold text-slate-700">Lost Items</p>
            <span className="text-[11px] text-slate-400">Reported across campus</span>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-soft text-center space-y-1">
            <h3 className="text-3xl sm:text-4xl font-black text-blue-600 tracking-tight">980+</h3>
            <p className="text-xs sm:text-sm font-semibold text-slate-700">Found Items</p>
            <span className="text-[11px] text-slate-400">Logged in custody</span>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-soft text-center space-y-1">
            <h3 className="text-3xl sm:text-4xl font-black text-emerald-600 tracking-tight">720+</h3>
            <p className="text-xs sm:text-sm font-semibold text-slate-700">Items Returned</p>
            <span className="text-[11px] text-slate-400">Successfully reunited</span>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-soft text-center space-y-1">
            <h3 className="text-3xl sm:text-4xl font-black text-amber-600 tracking-tight">5,000+</h3>
            <p className="text-xs sm:text-sm font-semibold text-slate-700">Active Users</p>
            <span className="text-[11px] text-slate-400">Students and faculty</span>
          </div>
        </div>
      </section>

      {/* 3. AI Matching Highlight Section (Section 8) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-2xl border border-slate-800">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold uppercase tracking-wider border border-blue-400/30">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Next-Gen Feature</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                AI-Powered Possible Matches
              </h2>
              <p className="text-sm sm:text-base text-slate-300 max-w-xl leading-relaxed">
                Upload an image of your lost item and CampusFind can suggest visually similar found items. Our simulated computer vision analyzes color schemes, shapes, brand markers, and campus proximity.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <Link
                  to="/ai-matches"
                  className="px-6 py-3 rounded-xl font-bold text-xs sm:text-sm text-slate-900 bg-white hover:bg-slate-100 shadow-md transition-colors flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  <span>Try AI Matching</span>
                </Link>

                <span className="text-xs text-slate-400">
                  Instant visual similarity scanning • No fees
                </span>
              </div>
            </div>

            <div className="lg:col-span-5 flex justify-center">
              <div className="w-full max-w-sm bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/20 shadow-xl space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-300 pb-2 border-b border-white/10">
                  <span className="font-semibold">Simulated Match Detection</span>
                  <span className="text-emerald-400 font-bold">94% Possible Match</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="rounded-xl overflow-hidden aspect-square bg-black/40 border border-white/10">
                    <img
                      src="https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&q=80&w=300"
                      alt="Lost Item"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="rounded-xl overflow-hidden aspect-square bg-black/40 border border-white/10">
                    <img
                      src="https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&q=80&w=300"
                      alt="Found Match"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                <div className="space-y-1.5 pt-1 text-[11px] text-slate-300">
                  <div className="flex justify-between">
                    <span>Visual Similarity</span>
                    <span className="text-blue-300 font-bold">96%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Location Proximity</span>
                    <span className="text-blue-300 font-bold">88%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. How It Works (Section 8: 1. Report, 2. Search, 3. Match, 4. Claim, 5. Return) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            How It Works
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            A seamless five-step recovery lifecycle designed for college campuses.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {HOW_IT_WORKS_STEPS.map((step) => (
            <div
              key={step.step}
              className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-soft hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                <span className="text-2xl font-black text-blue-600 font-mono">
                  {step.step}
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-2 mb-1.5 group-hover:text-blue-600 transition-colors">
                  {step.title}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {step.description}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-blue-600">
                <span>Step {step.step}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Featured Lost Items */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Featured Lost Items
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Active missing belongings reported recently by campus members.
            </p>
          </div>
          <Link to="/lost-items" className="text-xs sm:text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1">
            <span>Explore All Lost Items</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {lostItems.map((item) => (
            <ItemCard key={item.id} item={item} type="lost" />
          ))}
        </div>
      </section>

      {/* 6. Featured Found Items */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Featured Found Items
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Items handed in at security desks or found by students waiting for recovery.
            </p>
          </div>
          <Link to="/found-items" className="text-xs sm:text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1">
            <span>Explore All Found Items</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {foundItems.map((item) => (
            <ItemCard key={item.id} item={item} type="found" />
          ))}
        </div>
      </section>

      {/* 7. Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Browse by Category
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Select a category to view lost and found items on campus.
            </p>
          </div>
          <Link to="/lost-items" className="text-xs sm:text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1">
            <span>All Categories</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-9 gap-3">
          {CATEGORIES.map((cat) => {
            const IconComp = iconMap[cat.icon] || Box;
            return (
              <button
                key={cat.id}
                onClick={() => navigate(`/lost-items?category=${encodeURIComponent(cat.name)}`)}
                className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white border border-slate-200/80 shadow-soft hover:shadow-md hover:-translate-y-1 transition-all group text-center"
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-2.5 transition-transform group-hover:scale-110 ${cat.color}`}>
                  <IconComp className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold text-slate-800 line-clamp-1 group-hover:text-blue-600">
                  {cat.name}
                </span>
                <span className="text-[10px] text-slate-400 font-medium mt-0.5">
                  {cat.count} items
                </span>
              </button>
            );
          })}
        </div>
      </section>

    </div>
  );
};

export default HomePage;
