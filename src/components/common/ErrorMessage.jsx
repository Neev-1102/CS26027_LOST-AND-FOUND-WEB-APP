import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import Button from './Button';

const ErrorMessage = ({ message = 'An error occurred. Please try again.', onRetry }) => {
  return (
    <div className="bg-rose-50 border border-rose-200 rounded-xl p-6 text-center max-w-md mx-auto my-6">
      <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-3">
        <AlertCircle className="w-6 h-6" />
      </div>
      <h3 className="text-base font-semibold text-rose-900 mb-1">Something went wrong</h3>
      <p className="text-sm text-rose-700 mb-4">{message}</p>
      {onRetry && (
        <Button variant="secondary" onClick={onRetry} className="inline-flex items-center gap-2">
          <RefreshCw className="w-4 h-4" /> Try Again
        </Button>
      )}
    </div>
  );
};

export default ErrorMessage;
