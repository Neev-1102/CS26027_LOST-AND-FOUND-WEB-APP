import React from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, Search, Sparkles, ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';
import Button from '../../components/common/Button';

const HowItWorksPage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="px-3.5 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider">
          Step-by-Step Guide
        </span>
        <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
          How CampusFind Works
        </h1>
        <p className="text-base text-slate-600 leading-relaxed">
          Learn how our college Lost & Found SaaS platform connects lost belongings with their rightful owners safely and transparently.
        </p>
      </div>

      {/* 4 Steps Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-soft space-y-4 relative overflow-hidden group hover:border-blue-500 transition-colors">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-black text-2xl">
            01
          </div>
          <h3 className="text-2xl font-extrabold text-slate-900">01. Report Missing or Found Item</h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            Fill out a quick report with item details including category, campus location (Library, Canteen, Gym, Labs), date/time, and upload an image preview.
          </p>
          <div className="pt-2">
            <Link to="/report-lost">
              <Button variant="primary" size="sm" icon={PlusCircle}>
                Report Lost Belonging
              </Button>
            </Link>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-soft space-y-4 relative overflow-hidden group hover:border-blue-500 transition-colors">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-2xl">
            02
          </div>
          <h3 className="text-2xl font-extrabold text-slate-900">02. Intelligent Campus Search</h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            Search our indexed directory using keyword queries or filter by category, campus venue, and date reported to locate your missing item.
          </p>
          <div className="pt-2">
            <Link to="/lost-items">
              <Button variant="outline" size="sm" icon={Search}>
                Browse Lost Items
              </Button>
            </Link>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-soft space-y-4 relative overflow-hidden group hover:border-blue-500 transition-colors">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black text-2xl">
            03
          </div>
          <h3 className="text-2xl font-extrabold text-slate-900">03. Smart Match Recommendation</h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            Our match engine evaluates attributes (category, location, date, color) and calculates match scores so you are notified immediately when a matching item is found.
          </p>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-600">
            <Sparkles className="w-4 h-4" /> 92%+ Automated Match Accuracy
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-soft space-y-4 relative overflow-hidden group hover:border-blue-500 transition-colors">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-black text-2xl">
            04
          </div>
          <h3 className="text-2xl font-extrabold text-slate-900">04. Ownership Claim & Recovery</h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            Submit a claim describing unique identifying features or proof of purchase. Campus security reviews your proof and approves pickup at Room 104.
          </p>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
            <ShieldCheck className="w-4 h-4 text-blue-600" /> Admin Verified Protocol
          </div>
        </div>

      </div>

    </div>
  );
};

export default HowItWorksPage;
