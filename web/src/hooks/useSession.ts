'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { UserSession } from '@/lib/types';

export function useSession() {
  const queryClient = useQueryClient();

  const { data: user, isLoading, error } = useQuery<UserSession | null>({
    queryKey: ['session'],
    queryFn: async () => {
      const res = await fetch('/api/auth/me');
      if (!res.ok) return null;
      const json = await res.json();
      return json.user || null;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await fetch('/api/auth/logout', { method: 'POST' });
    },
    onSuccess: () => {
      queryClient.setQueryData(['session'], null);
    },
  });

  const isAuth = !!user;
  const isMod = user ? ['moderator', 'official'].includes(user.trust_tier) : false;

  return {
    user,
    isLoading,
    isAuthenticated: isAuth,
    isModerator: isMod,
    trustTier: user?.trust_tier || 'new',
    logout: logoutMutation.mutate,
  };
}
