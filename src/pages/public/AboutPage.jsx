import React from 'react';
import { ShieldCheck, Lock, Users, Award, Building, Mail, Phone } from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-8 sm:p-14 text-white shadow-2xl space-y-4">
        <span className="px-3.5 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-extrabold uppercase border border-blue-400/30">
          About CampusFind
        </span>
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white max-w-3xl">
          Empowering College Communities Through Secure Belonging Recovery.
        </h1>
        <p className="text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
          CampusFind replaces outdated physical lost-and-found boxes with a modern, digital MERN stack SaaS ecosystem built for transparency, privacy, and speed.
        </p>
      </div>

      {/* Core Principles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-soft space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Verified Identity</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            All users authenticate with official college email domains (@campusfind.edu) and student/faculty IDs to prevent fraudulent claims.
          </p>
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-soft space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Privacy Safeguards</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Personal phone numbers, emails, and sensitive unique identifiers are kept private and accessible only to security desk administrators.
          </p>
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-soft space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Security Desk Protocol</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Physical items are held securely in Room 104 with digital logging and audit trails for complete administrative accountability.
          </p>
        </div>

      </div>

      {/* Contact Section */}
      <div className="bg-white p-8 sm:p-12 rounded-3xl border border-slate-200 shadow-soft space-y-6">
        <h2 className="text-2xl font-black text-slate-900">Campus Security & Administration Contact</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
          <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <Building className="w-5 h-5 text-blue-600 shrink-0" />
            <div>
              <p className="font-bold text-slate-800">Security Office</p>
              <p className="text-xs text-slate-500">Central Admin Bldg, Room 104</p>
            </div>
          </div>
          <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <Phone className="w-5 h-5 text-blue-600 shrink-0" />
            <div>
              <p className="font-bold text-slate-800">24/7 Helpline</p>
              <p className="text-xs text-slate-500">+1 (555) 999-CAMPUS</p>
            </div>
          </div>
          <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <Mail className="w-5 h-5 text-blue-600 shrink-0" />
            <div>
              <p className="font-bold text-slate-800">Official Email</p>
              <p className="text-xs text-slate-500">support@campusfind.edu</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default AboutPage;
