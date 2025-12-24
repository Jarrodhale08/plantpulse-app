/**
 * RevenueCat Service
 * Handles in-app purchases, subscriptions, and entitlement management
 *
 * Documentation: https://www.revenuecat.com/docs
 */

import { Platform } from 'react-native';
import Purchases, {
  PurchasesOffering,
  PurchasesPackage,
  CustomerInfo,
  LOG_LEVEL,
  PurchasesError,
} from 'react-native-purchases';

// Configuration
const REVENUECAT_API_KEY = 'YOUR_REVENUECAT_API_KEY';
const ENTITLEMENT_ID = 'plantpulse_pro';

// Track initialization state
let isInitialized = false;

/**
 * Initialize RevenueCat SDK
 * Call this once at app startup (e.g., in _layout.tsx or App.tsx)
 */
export const initializeRevenueCat = async (): Promise<void> => {
  if (isInitialized) {
    console.log('[RevenueCat] Already initialized');
    return;
  }

  try {
    // Enable debug logs in development
    if (__DEV__) {
      Purchases.setLogLevel(LOG_LEVEL.DEBUG);
    }

    // Configure with API key
    await Purchases.configure({ apiKey: REVENUECAT_API_KEY });

    isInitialized = true;
    console.log('[RevenueCat] Initialized successfully');
  } catch (error) {
    console.error('[RevenueCat] Initialization failed:', error);
    throw error;
  }
};

/**
 * Check if RevenueCat is initialized
 */
export const isRevenueCatInitialized = (): boolean => isInitialized;

/**
 * Get current customer info
 */
export const getCustomerInfo = async (): Promise<CustomerInfo> => {
  try {
    const customerInfo = await Purchases.getCustomerInfo();
    return customerInfo;
  } catch (error) {
    console.error('[RevenueCat] Failed to get customer info:', error);
    throw error;
  }
};

/**
 * Check if user has active premium entitlement
 */
export const checkPremiumStatus = async (): Promise<boolean> => {
  try {
    const customerInfo = await Purchases.getCustomerInfo();
    return typeof customerInfo.entitlements.active[ENTITLEMENT_ID] !== 'undefined';
  } catch (error) {
    console.error('[RevenueCat] Failed to check premium status:', error);
    return false;
  }
};

/**
 * Get available offerings (products for sale)
 */
export const getOfferings = async (): Promise<PurchasesOffering | null> => {
  try {
    const offerings = await Purchases.getOfferings();

    if (offerings.current && offerings.current.availablePackages.length > 0) {
      return offerings.current;
    }

    console.warn('[RevenueCat] No offerings available');
    return null;
  } catch (error) {
    console.error('[RevenueCat] Failed to get offerings:', error);
    throw error;
  }
};

/**
 * Get specific package by identifier
 */
export const getPackage = async (
  packageId: 'monthly' | 'yearly' | 'lifetime'
): Promise<PurchasesPackage | null> => {
  try {
    const offering = await getOfferings();
    if (!offering) return null;

    switch (packageId) {
      case 'monthly':
        return offering.monthly ?? null;
      case 'yearly':
        return offering.annual ?? null;
      case 'lifetime':
        return offering.lifetime ?? null;
      default:
        return null;
    }
  } catch (error) {
    console.error('[RevenueCat] Failed to get package:', error);
    return null;
  }
};

/**
 * Purchase a package
 */
export const purchasePackage = async (
  pkg: PurchasesPackage
): Promise<{ success: boolean; customerInfo?: CustomerInfo; error?: string }> => {
  try {
    const { customerInfo } = await Purchases.purchasePackage(pkg);

    const isPremium = typeof customerInfo.entitlements.active[ENTITLEMENT_ID] !== 'undefined';

    return {
      success: isPremium,
      customerInfo,
    };
  } catch (error) {
    const purchaseError = error as PurchasesError;

    // User cancelled - not a real error
    if (purchaseError.userCancelled) {
      return { success: false, error: 'cancelled' };
    }

    console.error('[RevenueCat] Purchase failed:', purchaseError);
    return {
      success: false,
      error: purchaseError.message || 'Purchase failed',
    };
  }
};

/**
 * Restore previous purchases
 */
export const restorePurchases = async (): Promise<{
  success: boolean;
  isPremium: boolean;
  customerInfo?: CustomerInfo;
  error?: string;
}> => {
  try {
    const customerInfo = await Purchases.restorePurchases();
    const isPremium = typeof customerInfo.entitlements.active[ENTITLEMENT_ID] !== 'undefined';

    return {
      success: true,
      isPremium,
      customerInfo,
    };
  } catch (error) {
    const purchaseError = error as PurchasesError;
    console.error('[RevenueCat] Restore failed:', purchaseError);

    return {
      success: false,
      isPremium: false,
      error: purchaseError.message || 'Restore failed',
    };
  }
};

/**
 * Identify user (link purchases to your user system)
 * Call this after user logs in
 */
export const identifyUser = async (userId: string): Promise<CustomerInfo> => {
  try {
    const { customerInfo } = await Purchases.logIn(userId);
    console.log('[RevenueCat] User identified:', userId);
    return customerInfo;
  } catch (error) {
    console.error('[RevenueCat] Failed to identify user:', error);
    throw error;
  }
};

/**
 * Log out user (reset to anonymous)
 * Call this when user logs out
 */
export const logOutUser = async (): Promise<CustomerInfo> => {
  try {
    const customerInfo = await Purchases.logOut();
    console.log('[RevenueCat] User logged out');
    return customerInfo;
  } catch (error) {
    console.error('[RevenueCat] Failed to log out:', error);
    throw error;
  }
};

/**
 * Add listener for customer info updates
 */
export const addCustomerInfoUpdateListener = (
  listener: (customerInfo: CustomerInfo) => void
): (() => void) => {
  const subscription = Purchases.addCustomerInfoUpdateListener(listener);
  return () => subscription.remove();
};

/**
 * Get entitlement expiration date
 */
export const getEntitlementExpiration = async (): Promise<Date | null> => {
  try {
    const customerInfo = await Purchases.getCustomerInfo();
    const entitlement = customerInfo.entitlements.active[ENTITLEMENT_ID];

    if (entitlement?.expirationDate) {
      return new Date(entitlement.expirationDate);
    }

    return null;
  } catch (error) {
    console.error('[RevenueCat] Failed to get expiration:', error);
    return null;
  }
};

/**
 * Format price for display
 */
export const formatPrice = (pkg: PurchasesPackage): string => {
  return pkg.product.priceString;
};

/**
 * Get subscription period description
 */
export const getSubscriptionPeriod = (pkg: PurchasesPackage): string => {
  const identifier = pkg.packageType;

  switch (identifier) {
    case 'MONTHLY':
      return 'month';
    case 'ANNUAL':
      return 'year';
    case 'LIFETIME':
      return 'lifetime';
    case 'WEEKLY':
      return 'week';
    case 'SIX_MONTH':
      return '6 months';
    case 'THREE_MONTH':
      return '3 months';
    default:
      return '';
  }
};

export default {
  initialize: initializeRevenueCat,
  isInitialized: isRevenueCatInitialized,
  getCustomerInfo,
  checkPremiumStatus,
  getOfferings,
  getPackage,
  purchasePackage,
  restorePurchases,
  identifyUser,
  logOutUser,
  addCustomerInfoUpdateListener,
  getEntitlementExpiration,
  formatPrice,
  getSubscriptionPeriod,
  ENTITLEMENT_ID,
};
