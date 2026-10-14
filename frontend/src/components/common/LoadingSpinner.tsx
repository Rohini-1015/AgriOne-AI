import React from 'react';
import { Sprout } from 'lucide-react';

export const LoadingSpinner: React.FC<{ message?: string }> = ({
  message = 'Loading agricultural data...',
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="relative flex items-center justify-center">
        <div className="w-14 h-14 rounded-full border-4 border-agri-100 border-t-agri-600 animate-spin" />
        <Sprout className="w-6 h-6 text-agri-600 absolute animate-pulse" />
      </div>
      <p className="mt-4 text-xs font-semibold text-slate-600 tracking-wide uppercase">
        {message}
      </p>
    </div>
  );
};
