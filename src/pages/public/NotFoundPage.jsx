import React from 'react';
import { Link } from 'react-router-dom';
import { FileQuestion, Home, ArrowLeft } from 'lucide-react';
import Button from '../../components/common/Button';

const NotFoundPage = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 bg-slate-50">
      <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200/80 p-8 shadow-sm text-center">
        <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <FileQuestion className="w-8 h-8" />
        </div>
        <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Error 404</span>
        <h1 className="text-2xl font-extrabold text-slate-900 mt-1 mb-2">Page Not Found</h1>
        <p className="text-sm text-slate-600 mb-6 leading-relaxed">
          The requested page or lost/found record could not be found or may have been moved.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link to="/">
            <Button variant="primary" icon={Home}>
              Return Home
            </Button>
          </Link>
          <Link to="/lost-items">
            <Button variant="secondary">
              Browse Lost Items
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
