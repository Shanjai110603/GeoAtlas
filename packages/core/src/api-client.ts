import {
  SearchResponse,
  AdminDetailResponse,
  HierarchyResponse,
  EntityDetailResponse,
  EntityListResponse,
  StatisticsResponse,
  CompareResponse,
  BusinessEntity,
  GISBufferResponse,
  GISDistanceResponse,
  GISContainsResponse,
  RouteResponse,
  Contribution,
  PresignedUrlResponse,
  Review,
} from './types';

export function createApiClient(baseUrl: string = 'http://localhost:3000', getAuthToken?: () => Promise<string | null> | string | null) {
  async function fetchApi<T>(path: string, options: RequestInit = {}): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (getAuthToken) {
      const token = await getAuthToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    const res = await fetch(`${baseUrl}${path}`, {
      ...options,
      headers,
    });

    if (!res.ok) {
      let errorMsg = `API request failed with status ${res.status}`;
      try {
        const errBody = await res.json();
        if (errBody.error) errorMsg = errBody.error;
      } catch (_) {}
      throw new Error(errorMsg);
    }

    return res.json();
  }

  return {
    // Search
    searchPlaces: (q: string, type?: string, bbox?: string, limit: number = 20, offset: number = 0) => {
      const params = new URLSearchParams({ q, limit: limit.toString(), offset: offset.toString() });
      if (type) params.append('type', type);
      if (bbox) params.append('bbox', bbox);
      return fetchApi<SearchResponse>(`/v1/search?${params.toString()}`);
    },

    // Admin & Hierarchy
    getAdminUnit: (id: string) => fetchApi<AdminDetailResponse>(`/v1/admin/${id}`),
    getHierarchy: (id: string) => fetchApi<HierarchyResponse>(`/v1/admin/${id}/hierarchy`),

    // Entities
    getEntity: (id: string) => fetchApi<EntityDetailResponse>(`/v1/entities/${id}`),
    getEntities: (type?: string, near?: string, radius?: string, sort?: string, limit: number = 50) => {
      const params = new URLSearchParams({ limit: limit.toString() });
      if (type) params.append('type', type);
      if (near) params.append('near', near);
      if (radius) params.append('radius', radius);
      if (sort) params.append('sort', sort);
      return fetchApi<EntityListResponse>(`/v1/entities?${params.toString()}`);
    },

    // Compare & Statistics
    comparePlaces: (ids: string[]) => fetchApi<CompareResponse>(`/v1/compare?ids=${ids.join(',')}`),
    getStatistics: (adminId: string, category?: string) => {
      const query = category ? `?category=${category}` : '';
      return fetchApi<StatisticsResponse>(`/v1/statistics/${adminId}${query}`);
    },

    // Business & Reviews
    getBusiness: (id: string) => fetchApi<BusinessEntity>(`/v1/business/${id}`),
    submitReview: (businessId: string, rating: number, text: string, photos?: string[]) =>
      fetchApi<{ message: string; review: Review }>(`/v1/business/${businessId}/reviews`, {
        method: 'POST',
        body: JSON.stringify({ rating, text, photos }),
      }),
    getPresignedPhotoUrl: (businessId: string, filename: string, contentType: string) =>
      fetchApi<PresignedUrlResponse>(`/v1/business/${businessId}/photos/presign`, {
        method: 'POST',
        body: JSON.stringify({ filename, content_type: contentType }),
      }),

    // Contributions & Moderation
    submitContribution: (
      targetTable: string,
      targetId: string | null,
      diff: Record<string, any>,
      source?: string
    ) =>
      fetchApi<{ message: string; contribution: Contribution }>('/v1/contributions', {
        method: 'POST',
        body: JSON.stringify({ target_table: targetTable, target_id: targetId, diff, source }),
      }),

    getContributionStatus: (id: string) => fetchApi<{ contribution: Contribution }>(`/v1/contributions/${id}/status`),

    reviewContribution: (id: string, action: 'approve' | 'reject') =>
      fetchApi<{ message: string; contribution: Contribution }>(`/v1/contributions/${id}/review`, {
        method: 'POST',
        body: JSON.stringify({ action }),
      }),

    // GIS & Routing
    gisBuffer: (lat: number, lng: number, radiusMeters: number) =>
      fetchApi<GISBufferResponse>(`/v1/gis/buffer?lat=${lat}&lng=${lng}&radius=${radiusMeters}`),

    gisDistance: (fromLat: number, fromLng: number, toLat: number, toLng: number) =>
      fetchApi<GISDistanceResponse>(`/v1/gis/distance?from=${fromLat},${fromLng}&to=${toLat},${toLng}`),

    gisContains: (lat: number, lng: number, adminId: string) =>
      fetchApi<GISContainsResponse>(`/v1/gis/contains?lat=${lat}&lng=${lng}&admin_id=${adminId}`),

    gisNearest: (lat: number, lng: number, type?: string, limit: number = 10) => {
      const params = new URLSearchParams({ lat: lat.toString(), lng: lng.toString(), limit: limit.toString() });
      if (type) params.append('type', type);
      return fetchApi<EntityListResponse>(`/v1/gis/nearest?${params.toString()}`);
    },

    getRoute: (fromLat: number, fromLng: number, toLat: number, toLng: number, mode: string = 'driving') =>
      fetchApi<RouteResponse>(`/v1/route?from=${fromLat},${fromLng}&to=${toLat},${toLng}&mode=${mode}`),

    // Geocoding
    geocode: (address: string) => fetchApi<{ results: any[]; attribution: string }>(`/v1/geocode?address=${encodeURIComponent(address)}`),
    reverseGeocode: (lat: number, lng: number) => fetchApi<any>(`/v1/reverse-geocode?lat=${lat}&lng=${lng}`),
  };
}

export const apiClient = createApiClient();
