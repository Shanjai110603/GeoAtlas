'use client';

import React, { useState } from 'react';
import { apiClient } from '@/lib/api-client';
import { CompareTable } from '@/components/compare/CompareTable';
import { SearchBar } from '@/components/search/SearchBar';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { GitCompare, X, Plus } from 'lucide-react';
import { CompareResponse, SearchResult } from '@/lib/types';

export default function ComparePage() {
  const [selectedPlaces, setSelectedPlaces] = useState<SearchResult[]>([]);
  const [comparisonData, setComparisonData] = useState<CompareResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);

  const handleSearch = async (q: string) => {
    if (!q) {
      setSearchResults([]);
      return;
    }
    try {
      const res = await apiClient.searchPlaces(q, undefined, undefined, 5, 0);
      setSearchResults(res.results);
    } catch (_) {
      setSearchResults([]);
    }
  };

  const handleAddPlace = (place: SearchResult) => {
    if (!selectedPlaces.some((p) => p.id === place.id)) {
      setSelectedPlaces((prev) => [...prev, place]);
    }
    setSearchResults([]);
  };

  const handleRemovePlace = (id: string) => {
    setSelectedPlaces((prev) => prev.filter((p) => p.id !== id));
  };

  const handleRunComparison = async () => {
    if (selectedPlaces.length === 0) return;
    setLoading(true);
    try {
      const ids = selectedPlaces.map((p) => p.id);
      const res = await apiClient.comparePlaces(ids);
      setComparisonData(res);
    } catch (err: any) {
      alert(`Comparison failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-100 flex items-center gap-2">
          <GitCompare className="text-blue-500" size={32} />
          Geographic Comparison Tool
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Select two or more administrative units to compare surface area, level, and structural attributes side by side.
        </p>
      </div>

      <Card glass className="flex flex-col gap-4">
        <div className="relative">
          <SearchBar onSearch={handleSearch} placeholder="Search places to add to comparison..." />
          {searchResults.length > 0 && (
            <div className="absolute top-14 left-0 right-0 z-20 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden divide-y divide-slate-800">
              {searchResults.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleAddPlace(item)}
                  className="p-3 hover:bg-slate-800 cursor-pointer flex items-center justify-between transition-colors"
                >
                  <span className="font-semibold text-slate-200 text-sm">{item.name}</span>
                  <Plus size={16} className="text-blue-400" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Selected places chips */}
        {selectedPlaces.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap mt-2">
            <span className="text-xs text-slate-400 font-medium">Selected Places:</span>
            {selectedPlaces.map((place) => (
              <span
                key={place.id}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-950/60 border border-blue-800/80 rounded-xl text-xs font-medium text-blue-200"
              >
                {place.name}
                <button
                  onClick={() => handleRemovePlace(place.id)}
                  className="hover:text-red-400 transition-colors"
                >
                  <X size={14} />
                </button>
              </span>
            ))}
          </div>
        )}

        <Button
          onClick={handleRunComparison}
          isLoading={loading}
          disabled={selectedPlaces.length === 0}
          className="self-start mt-2"
        >
          Compare Selected Places
        </Button>
      </Card>

      {comparisonData && (
        <div className="mt-4">
          <CompareTable items={comparisonData.comparison} attribution={comparisonData.attribution} />
        </div>
      )}
    </div>
  );
}
