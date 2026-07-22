'use client';

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

export function usePlace(id: string) {
  return useQuery({
    queryKey: ['place', id],
    queryFn: async () => {
      try {
        const adminData = await apiClient.getAdminUnit(id);
        const hierarchyData = await apiClient.getHierarchy(id);
        return {
          type: 'admin',
          unit: adminData.admin_unit,
          children: adminData.children,
          ancestors: hierarchyData.ancestors,
          attribution: adminData.attribution,
        };
      } catch (_) {
        const entityData = await apiClient.getEntity(id);
        return {
          type: 'entity',
          entity: entityData.entity,
          attribution: entityData.attribution,
        };
      }
    },
    enabled: !!id,
  });
}
