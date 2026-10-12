import React from 'react';
import { AlertOctagon, RefreshCw } from 'lucide-react';
import Button from './Button';

const ErrorState = ({
  title = 'Something went wrong',
  description = 'We encountered an unexpected issue while fetching the data. Please try again.',
  onRetry
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 bg-rose-50/50 rounded-3xl border border-rose-100 text-center my-6">
      <div className="w-16 h-16 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mb-4">
        <AlertOctagon className="w-8 h-8" />
      </div>
      <h3 className="text-lg font-bold text-rose-900">{title}</h3>
      <p className="text-sm text-rose-700 max-w-sm mt-1 mb-6">{description}</p>
      {onRetry && (
        <Button variant="danger" size="sm" icon={RefreshCw} onClick={onRetry}>
          Try Again
        </Button>
      )}
    </div>
  );
};

export default ErrorState;
