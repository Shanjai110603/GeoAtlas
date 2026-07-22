import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'pending' | 'approved' | 'rejected' | 'default' | 'emerald';
}

export const Badge: React.FC<BadgeProps> = ({ className, variant = 'default', children, ...props }) => {
  const base = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider';

  const variants = {
    default: 'bg-slate-800 text-slate-300 border border-slate-700',
    pending: 'bg-amber-950/60 text-amber-400 border border-amber-800/60',
    approved: 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/60',
    rejected: 'bg-red-950/60 text-red-400 border border-red-800/60',
    emerald: 'bg-emerald-900/40 text-emerald-300 border border-emerald-700/50',
  };

  return (
    <span className={twMerge(clsx(base, variants[variant], className))} {...props}>
      {children}
    </span>
  );
};
