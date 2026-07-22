'use client';

import React, { useState, use } from 'react';
import { useSearchParams } from 'next/navigation';
import { SearchBar } from '@/components/search/SearchBar';
import { SearchResultsList } from '@/components/search/SearchResultsList';
import { MapView } from '@/components/map/MapView';
import { useSearch } from '@/hooks/useSearch';
import { SearchResult } from '@/lib/types';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const initialQ = searchParams.get('q') || 'hospital';
  const initialType = searchParams.get('type') || '';

  const [query, setQuery] = useState(initialQ);
  const [type, setType] = useState(initialType);
  const [selectedResult, setSelectedResult] = useState<SearchResult | undefined>();

  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useSearch(query, type);

  const results = data?.pages.flatMap((page) => page.results) || [];
  const totalHits = data?.pages[0]?.total_hits || 0;

  const handleSearch = (newQ: string, newType?: string) => {
    setQuery(newQ);
    setType(newType || '');
  };

  const center: [number, number] =
    selectedResult && selectedResult.geometry && selectedResult.geometry.type === 'Point'
      ? selectedResult.geometry.coordinates
      : [78.9629, 20.5937];

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col md:flex-row overflow-hidden">
      {/* Left Panel: Search Controls & Results */}
      <div className="w-full md:w-[480px] h-1/2 md:h-full flex flex-col p-4 border-r border-slate-800 bg-slate-950 overflow-y-auto no-scrollbar gap-4 shrink-0">
        <SearchBar initialQuery={query} initialType={type} onSearch={handleSearch} />

        <SearchResultsList
          results={results}
          totalHits={totalHits}
          isLoading={isLoading}
          isFetchingNextPage={isFetchingNextPage}
          hasNextPage={hasNextPage}
          onFetchNextPage={() => fetchNextPage()}
          onSelectResult={(item) => setSelectedResult(item)}
          selectedId={selectedResult?.id}
        />
      </div>

      {/* Right Panel: Split Map View */}
      <div className="flex-1 h-1/2 md:h-full relative">
        <MapView center={center} zoom={selectedResult ? 12 : 5} results={results} />
      </div>
    </div>
  );
}
