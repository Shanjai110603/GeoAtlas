import React from 'react';
import { ShieldAlert } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface AttributionBadgeProps {
  attribution?: string;
  className?: string;
}

export const AttributionBadge: React.FC<AttributionBadgeProps> = ({ attribution, className }) => {
  if (!attribution) return null;

  return (
    <div
      className={twMerge(
        clsx(
          'flex items-center gap-1.5 px-2.5 py-1 bg-slate-900/60 border border-slate-800/80 rounded-lg text-xs text-slate-400 font-medium',
          className
        )
      )}
    >
      <ShieldAlert size={12} className="text-blue-400 shrink-0" />
      <span className="truncate">{attribution}</span>
    </div>
  );
};
