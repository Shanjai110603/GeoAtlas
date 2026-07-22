'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, Filter } from 'lucide-react';

export interface SearchBarProps {
  initialQuery?: string;
  initialType?: string;
  onSearch?: (q: string, type?: string) => void;
  placeholder?: string;
}

const ENTITY_TYPES = [
  { id: '', label: 'All Types' },
  { id: 'hospital', label: 'Hospitals' },
  { id: 'school', label: 'Schools' },
  { id: 'business', label: 'Businesses' },
  { id: 'waterway', label: 'Waterways' },
  { id: 'mountain', label: 'Mountains' },
];

export const SearchBar: React.FC<SearchBarProps> = ({
  initialQuery = '',
  initialType = '',
  onSearch,
  placeholder = 'Search places, admin units, hospitals, schools...',
}) => {
  const router = useRouter();
  const [q, setQ] = useState(initialQuery);
  const [selectedType, setSelectedType] = useState(initialType);

  useEffect(() => {
    if (!onSearch) return;
    const timer = setTimeout(() => {
      onSearch(q, selectedType);
    }, 300);
    return () => clearTimeout(timer);
  }, [q, selectedType, onSearch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(q, selectedType);
    } else if (q.trim()) {
      const params = new URLSearchParams({ q });
      if (selectedType) params.append('type', selectedType);
      router.push(`/search?${params.toString()}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-3">
      <div className="relative flex items-center w-full">
        <Search className="absolute left-3.5 text-slate-400 pointer-events-none" size={18} />
        <input
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-3 bg-slate-900/90 border border-slate-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-slate-100 rounded-2xl text-base transition-all shadow-inner"
        />
        {q && (
          <button
            type="button"
            onClick={() => setQ('')}
            className="absolute right-3.5 text-slate-400 hover:text-slate-200 transition-colors"
          >
            <X size={18} />
          </button>
        )}
      </div>

      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
        <span className="text-xs text-slate-500 font-medium flex items-center gap-1 mr-1">
          <Filter size={12} /> Filters:
        </span>
        {ENTITY_TYPES.map((t) => {
          const isSelected = selectedType === t.id;
          return (
            <button
              type="button"
              key={t.id}
              onClick={() => {
                setSelectedType(t.id);
                if (!onSearch && q.trim()) {
                  const params = new URLSearchParams({ q, type: t.id });
                  router.push(`/search?${params.toString()}`);
                }
              }}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all whitespace-nowrap border ${
                isSelected
                  ? 'bg-blue-600/30 text-blue-300 border-blue-500/60'
                  : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200'
              }`}
            >
              {t.label}
            </button>
          );
        })}
      </div>
    </form>
  );
};
