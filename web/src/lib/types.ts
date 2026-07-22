export interface Geometry {
  type: string;
  coordinates: any;
}

export interface AdminUnit {
  id: string;
  country_code: string;
  level_number: number;
  local_term?: string;
  parent_id?: string;
  name: string;
  native_name?: string;
  source?: string;
  geometry?: Geometry;
  centroid?: Geometry;
  area_sq_km?: number;
}

export interface Entity {
  id: string;
  entity_type: string;
  name: string;
  native_name?: string;
  admin_level_id?: string;
  attributes?: Record<string, any>;
  confidence_score?: number;
  source?: string;
  source_id?: string;
  geometry?: Geometry;
  attribution?: string;
}

export interface Review {
  id: string;
  entity_id: string;
  user_id?: string;
  rating: number;
  text: string;
  photos?: string[];
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  display_name?: string;
}

export interface BusinessEntity {
  business: Entity;
  reviews: Review[];
  attribution?: string;
}

export interface SearchResult {
  id: string;
  entity_type?: string;
  name: string;
  native_name?: string;
  admin_level_id?: string;
  attributes?: Record<string, any>;
  confidence_score?: number;
  source?: string;
  geometry?: Geometry;
  attribution?: string;
}

export interface SearchResponse {
  query: string;
  results: SearchResult[];
  total_hits: number;
  limit: number;
  offset: number;
  attribution?: string;
}

export interface HierarchyItem {
  id: string;
  country_code: string;
  level_number: number;
  local_term?: string;
  name: string;
  native_name?: string;
  depth: number;
}

export interface HierarchyResponse {
  descendant_id: string;
  ancestors: HierarchyItem[];
  attribution?: string;
}

export interface AdminDetailResponse {
  admin_unit: AdminUnit;
  children: AdminUnit[];
  attribution?: string;
}

export interface EntityDetailResponse {
  entity: Entity;
  attribution?: string;
}

export interface EntityListResponse {
  entities: Entity[];
  attribution?: string;
}

export interface StatisticsData {
  entity_counts: Array<{ entity_type: string; count: number }>;
  child_admin_units: number;
  area_sq_km: number;
}

export interface StatisticsResponse {
  admin_unit: {
    id: string;
    name: string;
    country_code: string;
    level_number: number;
  };
  statistics: StatisticsData;
  attribution?: string;
}

export interface CompareResponse {
  comparison: Array<{
    id: string;
    name: string;
    level_number: number;
    local_term?: string;
    country_code: string;
    area_sq_km: number;
  }>;
  attribution?: string;
}

export interface GISBufferResponse {
  center: { lat: number; lng: number };
  radius_meters: number;
  buffer_geometry: Geometry;
  attribution?: string;
}

export interface GISDistanceResponse {
  from: { lat: number; lng: number };
  to: { lat: number; lng: number };
  distance_meters: number;
  attribution?: string;
}

export interface GISContainsResponse {
  point: { lat: number; lng: number };
  admin_id: string;
  is_contained: boolean;
}

export interface RouteWaypoint {
  hint: string;
  distance: number;
  name: string;
  location: [number, number];
}

export interface RouteItem {
  distance: number;
  duration: number;
  geometry: string | Geometry;
  weight: number;
}

export interface RouteResponse {
  code: string;
  routes: RouteItem[];
  waypoints: RouteWaypoint[];
  attribution?: string;
}

export interface Contribution {
  id: string;
  editor_id?: string;
  target_table: string;
  target_id?: string;
  diff: Record<string, any>;
  status: 'pending' | 'approved' | 'rejected';
  source?: string;
  created_at: string;
  reviewed_at?: string;
  reviewed_by?: string;
}

export interface UserSession {
  id: string;
  email: string;
  display_name: string;
  trust_tier: 'new' | 'trusted' | 'moderator' | 'official';
  accepted_edit_count: number;
}

export interface AuthResponse {
  user: UserSession;
  token: string;
}

export interface PresignedUrlResponse {
  message: string;
  upload_url: string;
  file_url: string;
  object_key: string;
  entity_id: string;
  moderation_status: string;
}
