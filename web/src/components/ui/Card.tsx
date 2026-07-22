import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  glass?: boolean;
}

export const Card: React.FC<CardProps> = ({ className, glass = true, children, ...props }) => {
  return (
    <div
      className={twMerge(
        clsx(
          'rounded-2xl border p-5 transition-all duration-200',
          glass
            ? 'bg-slate-900/60 backdrop-blur-md border-slate-800/80 shadow-lg hover:border-slate-700/80'
            : 'bg-slate-900 border-slate-800 shadow-md',
          className
        )
      )}
      {...props}
    >
      {children}
    </div>
  );
};
