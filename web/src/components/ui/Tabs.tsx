'use client';

import React, { useState } from 'react';
import { clsx } from 'clsx';

export interface TabItem {
  id: string;
  label: string;
  content: React.ReactNode;
}

export interface TabsProps {
  tabs: TabItem[];
  defaultTabId?: string;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({ tabs, defaultTabId, className }) => {
  const [activeId, setActiveId] = useState(defaultTabId || tabs[0]?.id);

  if (!tabs || tabs.length === 0) return null;

  const activeTab = tabs.find((t) => t.id === activeId) || tabs[0];

  return (
    <div className={clsx('w-full flex flex-col gap-4', className)}>
      <div className="flex border-b border-slate-800 overflow-x-auto no-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveId(tab.id)}
            className={clsx(
              'px-4 py-2.5 text-sm font-medium border-b-2 transition-all whitespace-nowrap',
              activeId === tab.id
                ? 'border-blue-500 text-blue-400 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="pt-2">{activeTab?.content}</div>
    </div>
  );
};
