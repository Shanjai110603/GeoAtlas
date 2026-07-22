export type TeamRole = 'admin' | 'editor' | 'viewer';

export interface WorkspaceMember {
  userId: string;
  displayName: string;
  email: string;
  role: TeamRole;
  joinedAt: string;
}

export interface AuditLogEvent {
  id: string;
  timestamp: string;
  actorName: string;
  action: string;
  resource: string;
  status: 'SUCCESS' | 'FAILURE';
}

export interface OrganizationWorkspace {
  id: string;
  name: string;
  slug: string;
  plan: 'enterprise' | 'team' | 'pro';
  members: WorkspaceMember[];
  ssoEnabled: boolean;
  ssoProvider?: string;
}

export const SAMPLE_WORKSPACE: OrganizationWorkspace = {
  id: 'ws_geo_enterprise',
  name: 'Global Geographic Analytics Corp',
  slug: 'geo-corp',
  plan: 'enterprise',
  ssoEnabled: true,
  ssoProvider: 'SAML 2.0 (Okta)',
  members: [
    {
      userId: 'u1',
      displayName: 'Shanjai (Org Owner)',
      email: 'shanjai@geocorp.org',
      role: 'admin',
      joinedAt: '2026-01-10',
    },
    {
      userId: 'u2',
      displayName: 'Priya Sundaram',
      email: 'priya@geocorp.org',
      role: 'editor',
      joinedAt: '2026-02-15',
    },
    {
      userId: 'u3',
      displayName: 'Alex Chen',
      email: 'alex@geocorp.org',
      role: 'viewer',
      joinedAt: '2026-03-01',
    },
  ],
};

export const SAMPLE_AUDIT_LOGS: AuditLogEvent[] = [
  {
    id: 'aud_101',
    timestamp: '10 mins ago',
    actorName: 'Shanjai (Org Owner)',
    action: 'CREATE_API_KEY',
    resource: 'Production Server Token',
    status: 'SUCCESS',
  },
  {
    id: 'aud_102',
    timestamp: '2 hours ago',
    actorName: 'Priya Sundaram',
    action: 'EXPORT_MAP_GEOJSON',
    resource: 'Tamil Nadu Hospital Buffer Layer',
    status: 'SUCCESS',
  },
  {
    id: 'aud_103',
    timestamp: '1 day ago',
    actorName: 'Alex Chen',
    action: 'TRIGGER_ETL_PIPELINE',
    resource: 'Natural Earth ADM1 Sync',
    status: 'SUCCESS',
  },
];

export function hasPermission(role: TeamRole, requiredAction: 'manage_team' | 'edit_data' | 'view_data'): boolean {
  if (role === 'admin') return true;
  if (role === 'editor' && (requiredAction === 'edit_data' || requiredAction === 'view_data')) return true;
  if (role === 'viewer' && requiredAction === 'view_data') return true;
  return false;
}
