'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

export function useSearch(query: string, type?: string, bbox?: string) {
  const limit = 10;

  return useInfiniteQuery({
    queryKey: ['search', query, type, bbox],
    queryFn: ({ pageParam = 0 }) => apiClient.searchPlaces(query, type, bbox, limit, pageParam as number),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      const nextOffset = lastPage.offset + lastPage.limit;
      return nextOffset < lastPage.total_hits ? nextOffset : undefined;
    },
    enabled: !!query && query.trim().length > 0,
  });
}
