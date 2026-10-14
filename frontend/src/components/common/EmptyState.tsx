import React from 'react';
import { PackageOpen } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionLabel,
  onAction,
  icon,
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-4 bg-white rounded-2xl border border-dashed border-slate-200">
      <div className="w-16 h-16 rounded-2xl bg-agri-50 text-agri-600 flex items-center justify-center mb-4">
        {icon || <PackageOpen className="w-8 h-8" />}
      </div>
      <h4 className="text-base font-bold text-slate-800">{title}</h4>
      <p className="text-xs text-slate-500 mt-1 max-w-sm">{description}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="mt-5 px-4 py-2 rounded-xl text-xs font-bold bg-agri-600 text-white hover:bg-agri-700 transition-colors shadow-xs"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};
