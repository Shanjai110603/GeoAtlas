'use client';

import React from 'react';
import Link from 'next/link';
import { SearchResult } from '@/lib/types';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { MapPin, ChevronRight, AlertCircle } from 'lucide-react';
import { AttributionBadge } from '@/components/place/AttributionBadge';

export interface SearchResultsListProps {
  results: SearchResult[];
  totalHits: number;
  isLoading: boolean;
  isFetchingNextPage: boolean;
  hasNextPage?: boolean;
  onFetchNextPage: () => void;
  onSelectResult?: (result: SearchResult) => void;
  selectedId?: string;
}

export const SearchResultsList: React.FC<SearchResultsListProps> = ({
  results,
  totalHits,
  isLoading,
  isFetchingNextPage,
  hasNextPage,
  onFetchNextPage,
  onSelectResult,
  selectedId,
}) => {
  if (isLoading) {
    return (
      <div className="flex flex-col gap-3 w-full">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>
    );
  }

  if (!results || results.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-slate-800 rounded-2xl">
        <AlertCircle size={36} className="text-slate-600 mb-2" />
        <p className="text-slate-300 font-medium">No geographic results found</p>
        <p className="text-xs text-slate-500 mt-1">Try adjusting search terms or clearing type filters</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 w-full">
      <div className="flex items-center justify-between text-xs text-slate-400 px-1">
        <span>
          Showing <strong className="text-slate-200">{results.length}</strong> of{' '}
          <strong className="text-slate-200">{totalHits}</strong> places
        </span>
        {totalHits > results.length && <span className="text-blue-400">Subset view (Paginated)</span>}
      </div>

      {results.map((item) => {
        const isSelected = item.id === selectedId;
        const targetHref = item.entity_type === 'business' ? `/business/${item.id}` : `/place/${item.id}`;

        return (
          <div
            key={item.id}
            onClick={() => onSelectResult && onSelectResult(item)}
            className="cursor-pointer"
          >
            <Card
              className={`transition-all duration-200 hover:border-blue-500/50 ${
                isSelected ? 'border-blue-500 bg-blue-950/20' : ''
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-slate-100 text-base flex items-center gap-1.5">
                      <MapPin size={16} className="text-blue-400 shrink-0" />
                      {item.name}
                    </span>
                    {item.native_name && (
                      <span className="text-xs text-slate-400 font-normal">({item.native_name})</span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 mt-1">
                    {item.entity_type && <Badge variant="emerald">{item.entity_type}</Badge>}
                    {item.confidence_score && (
                      <span className="text-[10px] text-slate-500">
                        Score: {(item.confidence_score * 100).toFixed(0)}%
                      </span>
                    )}
                  </div>
                </div>

                <Link
                  href={targetHref}
                  className="p-2 text-slate-400 hover:text-blue-400 hover:bg-slate-800 rounded-xl transition-all"
                >
                  <ChevronRight size={20} />
                </Link>
              </div>

              {item.attribution && <AttributionBadge attribution={item.attribution} className="mt-2 text-[10px]" />}
            </Card>
          </div>
        );
      })}

      {hasNextPage && (
        <div className="mt-2 text-center">
          <Button
            variant="secondary"
            size="md"
            isLoading={isFetchingNextPage}
            onClick={onFetchNextPage}
            className="w-full"
          >
            Load More Results
          </Button>
        </div>
      )}
    </div>
  );
};
