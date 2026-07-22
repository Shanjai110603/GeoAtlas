export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string; // lucide icon identifier
  requiredXP: number;
  category: 'cartography' | 'reviews' | 'photos' | 'moderation';
}

export interface UserLevelInfo {
  level: number;
  currentXP: number;
  nextLevelXP: number;
  progressPercent: number;
  trustTier: 'new' | 'trusted' | 'moderator' | 'official';
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  displayName: string;
  region: string;
  xp: number;
  level: number;
  acceptedEdits: number;
  badgesCount: number;
}

export const BADGE_DEFINITIONS: Badge[] = [
  {
    id: 'first_edit',
    name: 'Cartographer Candidate',
    description: 'Submitted your first geographic edit to the GeoAtlas queue',
    icon: 'MapPin',
    requiredXP: 50,
    category: 'cartography',
  },
  {
    id: 'storefront_scout',
    name: 'Storefront Specialist',
    description: 'Uploaded verified storefront photos to the business directory',
    icon: 'Camera',
    requiredXP: 150,
    category: 'photos',
  },
  {
    id: 'trusted_surveyor',
    name: 'Boundary Surveyor',
    description: 'Achieved Trusted Contributor status with over 500 XP',
    icon: 'ShieldCheck',
    requiredXP: 500,
    category: 'cartography',
  },
  {
    id: 'master_moderator',
    name: 'Master Moderator',
    description: 'Reviewed and merged over 100 community contributions',
    icon: 'Award',
    requiredXP: 2500,
    category: 'moderation',
  },
];

export function calculateLevelFromXP(xp: number): UserLevelInfo {
  // Base XP per level: Level N requires N * 200 XP
  let level = 1;
  let accumulatedXP = 0;

  while (xp >= accumulatedXP + level * 200) {
    accumulatedXP += level * 200;
    level += 1;
  }

  const currentLevelXP = xp - accumulatedXP;
  const nextLevelXP = level * 200;
  const progressPercent = Math.min(100, Math.round((currentLevelXP / nextLevelXP) * 100));

  let trustTier: UserLevelInfo['trustTier'] = 'new';
  if (xp >= 2500) {
    trustTier = 'moderator';
  } else if (xp >= 500) {
    trustTier = 'trusted';
  }

  return {
    level,
    currentXP: xp,
    nextLevelXP: accumulatedXP + nextLevelXP,
    progressPercent,
    trustTier,
  };
}

export const SAMPLE_LEADERBOARD_ENTRIES: LeaderboardEntry[] = [
  {
    rank: 1,
    userId: 'u1',
    displayName: 'Priya Sundaram',
    region: 'India / Tamil Nadu',
    xp: 3850,
    level: 6,
    acceptedEdits: 74,
    badgesCount: 4,
  },
  {
    rank: 2,
    userId: 'u2',
    displayName: 'Alex Chen',
    region: 'North America',
    xp: 2940,
    level: 5,
    acceptedEdits: 58,
    badgesCount: 3,
  },
  {
    rank: 3,
    userId: 'u3',
    displayName: 'Elena Rostova',
    region: 'Europe',
    xp: 2150,
    level: 4,
    acceptedEdits: 41,
    badgesCount: 3,
  },
  {
    rank: 4,
    userId: 'u4',
    displayName: 'Karthik Raja',
    region: 'India / Tamil Nadu',
    xp: 1820,
    level: 4,
    acceptedEdits: 35,
    badgesCount: 2,
  },
  {
    rank: 5,
    userId: 'u5',
    displayName: 'Sarah Jenkins',
    region: 'North America',
    xp: 1240,
    level: 3,
    acceptedEdits: 22,
    badgesCount: 2,
  },
];
