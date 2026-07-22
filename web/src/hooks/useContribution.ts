'use client';

import { useQuery, useMutation } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

export function useContributionStatus(id: string) {
  return useQuery({
    queryKey: ['contribution_status', id],
    queryFn: () => apiClient.getContributionStatus(id),
    enabled: !!id,
    refetchInterval: (query) => {
      const data = query.state.data;
      if (data && data.contribution && data.contribution.status === 'pending') {
        return 3000; // Poll every 3 seconds while pending
      }
      return false;
    },
  });
}
