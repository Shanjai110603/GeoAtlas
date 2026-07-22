export interface ApiKeyRecord {
  id: string;
  keySecret: string; // e.g. "geo_live_9f8a..."
  name: string;
  environment: 'production' | 'staging' | 'development';
  createdAt: string;
  lastUsedAt: string;
  rateLimitPerMin: number;
}

export interface ApiUsageQuota {
  totalRequestsThisMonth: number;
  monthlyLimit: number;
  rateLimitPerMin: number;
  activeKeysCount: number;
}

export const SAMPLE_API_KEYS: ApiKeyRecord[] = [
  {
    id: 'key_1',
    keySecret: 'geo_live_7a9f82b1c4e5d6a7b8c9d0e1f2a3b4c5',
    name: 'Production Web App Key',
    environment: 'production',
    createdAt: '2026-01-15',
    lastUsedAt: '2 mins ago',
    rateLimitPerMin: 1000,
  },
  {
    id: 'key_2',
    keySecret: 'geo_test_3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e',
    name: 'Staging GIS Pipeline',
    environment: 'staging',
    createdAt: '2026-03-01',
    lastUsedAt: '4 hours ago',
    rateLimitPerMin: 200,
  },
];

export const SAMPLE_USAGE_QUOTA: ApiUsageQuota = {
  totalRequestsThisMonth: 148520,
  monthlyLimit: 1000000,
  rateLimitPerMin: 1000,
  activeKeysCount: 2,
};

export function generateNewApiKey(name: string, env: ApiKeyRecord['environment']): ApiKeyRecord {
  const randomHex = Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
  const prefix = env === 'production' ? 'geo_live_' : 'geo_test_';

  return {
    id: `key_${Date.now()}`,
    keySecret: `${prefix}${randomHex}`,
    name,
    environment: env,
    createdAt: 'Just now',
    lastUsedAt: 'Never',
    rateLimitPerMin: env === 'production' ? 1000 : 200,
  };
}
