/**
 * Premium Features Configuration
 * Defines what features are available in free vs premium tiers
 */

export interface PremiumFeature {
  icon: string;
  title: string;
  description: string;
  freeLimit?: number | string;
  premiumLimit?: number | string;
}

export const PREMIUM_FEATURES: PremiumFeature[] = [
  {
    "icon": "🚫",
    "title": "Ad-Free Experience",
    "description": "Enjoy the app without any advertisements"
  },
  {
    "icon": "♾️",
    "title": "Unlimited Access",
    "description": "No daily limits or restrictions"
  },
  {
    "icon": "💾",
    "title": "Cloud Backup",
    "description": "Sync and backup your data across devices"
  },
  {
    "icon": "🔄",
    "title": "Cross-Device Sync",
    "description": "Access your data on all devices"
  },
  {
    "icon": "📁",
    "title": "Unlimited Projects",
    "description": "Create as many projects as you need"
  },
  {
    "icon": "👥",
    "title": "Team Collaboration",
    "description": "Share and collaborate with others"
  }
];

export const FREE_TIER_LIMITS = {
  maxPlants: 10,
  maxCareSchedules: 5,
  historyDays: 30,
  exportEnabled: false,
  adsEnabled: true,
  cloudSync: false,
  plantIdentification: false,
  advancedAnalytics: false,
};

export const PREMIUM_TIER_LIMITS = {
  maxPlants: Infinity,
  maxCareSchedules: Infinity,
  historyDays: 365,
  exportEnabled: true,
  adsEnabled: false,
  cloudSync: true,
  plantIdentification: true,
  advancedAnalytics: true,
};

export function getFeatureLimit(feature: keyof typeof FREE_TIER_LIMITS, isPremium: boolean) {
  return isPremium ? PREMIUM_TIER_LIMITS[feature] : FREE_TIER_LIMITS[feature];
}

export function canAccessFeature(feature: string, isPremium: boolean): boolean {
  if (isPremium) return true;

  // Free tier restrictions
  const restrictedFeatures = [
    'export',
    'customization',
    'unlimited',
    'advanced',
    'analytics',
    'sync',
    'backup',
    'identification',
  ];

  return !restrictedFeatures.some(r => feature.toLowerCase().includes(r));
}

// ============================================================================
// PLANT-SPECIFIC HELPER FUNCTIONS
// ============================================================================

/**
 * Check if plant limit is reached
 */
export function isPlantLimitReached(currentCount: number, isPremium: boolean): boolean {
  if (isPremium) return false;
  return currentCount >= FREE_TIER_LIMITS.maxPlants;
}

/**
 * Get remaining plants count
 */
export function getRemainingPlants(currentCount: number, isPremium: boolean): number | 'unlimited' {
  if (isPremium) return 'unlimited';
  const remaining = FREE_TIER_LIMITS.maxPlants - currentCount;
  return Math.max(0, remaining);
}

/**
 * Check if care schedule limit is reached
 */
export function isCareScheduleLimitReached(currentCount: number, isPremium: boolean): boolean {
  if (isPremium) return false;
  return currentCount >= FREE_TIER_LIMITS.maxCareSchedules;
}

/**
 * Get remaining care schedules count
 */
export function getRemainingCareSchedules(currentCount: number, isPremium: boolean): number | 'unlimited' {
  if (isPremium) return 'unlimited';
  const remaining = FREE_TIER_LIMITS.maxCareSchedules - currentCount;
  return Math.max(0, remaining);
}
