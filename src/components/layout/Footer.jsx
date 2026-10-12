import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Mail, Phone, MapPin, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xl shadow-lg">
                🔎
              </div>
              <span className="font-extrabold text-2xl tracking-tight text-white">
                Campus<span className="text-blue-500">Find</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              CampusFind is the official college Lost & Found management platform designed for students, faculty, and security personnel to quickly report, search, match, and recover lost belongings securely.
            </p>
            <div className="flex items-center gap-3 pt-2 text-xs font-semibold text-blue-400 bg-slate-800/60 p-3 rounded-xl border border-slate-700/50 w-fit">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Campus Security Verified Platform</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Quick Navigation</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/lost-items" className="hover:text-blue-400 transition-colors">
                  Lost Items Directory
                </Link>
              </li>
              <li>
                <Link to="/found-items" className="hover:text-blue-400 transition-colors">
                  Found Items Directory
                </Link>
              </li>
              <li>
                <Link to="/report-lost" className="hover:text-blue-400 transition-colors">
                  Report a Lost Belonging
                </Link>
              </li>
              <li>
                <Link to="/report-found" className="hover:text-blue-400 transition-colors">
                  Report a Found Item
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="hover:text-blue-400 transition-colors">
                  Matching & Claim Process
                </Link>
              </li>
            </ul>
          </div>

          {/* Security Policy */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Campus Safety</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/about" className="hover:text-blue-400 transition-colors">
                  Privacy & Data Protection
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-blue-400 transition-colors">
                  Verification Guidelines
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-blue-400 transition-colors">
                  Security Desk Protocol
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-blue-400 transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Security */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Campus Desk</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <span>Central Security & Admin Building, Room 104</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-blue-400 shrink-0" />
                <span>+1 (555) 999-CAMPUS</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                <span>security@campusfind.edu</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Copyright Footer */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} CampusFind — MERN Lost & Found SaaS Platform. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for College Excellence
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
