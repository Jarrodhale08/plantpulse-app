/**
 * Plant Identification Service - Plant.id API
 *
 * Uses Plant.id for accurate plant identification.
 * - Requires API key from https://admin.kindwise.com/
 * - 100 free identifications per day
 * - Accepts base64 images in JSON (React Native compatible)
 *
 * Set EXPO_PUBLIC_PLANTID_API_KEY in your .env file
 */

import { File } from 'expo-file-system/next';

const PLANTID_API_URL = 'https://plant.id/api/v3/identification';

export interface PlantIdentificationResult {
  /** Scientific name */
  className: string;
  /** Common/friendly name */
  displayName: string;
  /** Confidence score (0-1) */
  confidence: number;
  /** Whether this is likely a plant (always true for Plant.id) */
  isPlant: boolean;
}

export interface IdentificationResponse {
  success: boolean;
  results: PlantIdentificationResult[];
  bestMatch?: PlantIdentificationResult | undefined;
  error?: string | undefined;
  isOffline: boolean;
}

/**
 * Call Plant.id API with base64 image
 */
async function callPlantIdAPI(base64Image: string): Promise<{
  suggestions: Array<{
    name: string;
    probability: number;
    details?: {
      common_names?: string[];
    };
  }>;
}> {
  const apiKey = process.env.EXPO_PUBLIC_PLANTID_API_KEY;

  if (!apiKey) {
    throw new Error('Plant.id API key not configured. Set EXPO_PUBLIC_PLANTID_API_KEY in your .env file.');
  }

  console.log('[Plant.id] Sending identification request...');

  const response = await fetch(PLANTID_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Api-Key': apiKey,
    },
    body: JSON.stringify({
      images: [base64Image],
      similar_images: false,
    }),
  });

  console.log('[Plant.id] Response status:', response.status);

  if (!response.ok) {
    const errorText = await response.text();
    console.log('[Plant.id] Error response:', errorText.substring(0, 200));

    if (response.status === 401) {
      throw new Error('Invalid API key. Check your EXPO_PUBLIC_PLANTID_API_KEY.');
    }
    if (response.status === 429) {
      throw new Error('Daily limit reached. Try again tomorrow or upgrade your plan.');
    }
    throw new Error(`API error ${response.status}: ${errorText.substring(0, 100)}`);
  }

  const data = await response.json();
  console.log('[Plant.id] Got response with', data.result?.classification?.suggestions?.length || 0, 'suggestions');

  return {
    suggestions: data.result?.classification?.suggestions || [],
  };
}

/**
 * Identify a plant from an image using Plant.id
 *
 * @param imageUri - Local URI of the plant image
 * @returns Identification results with confidence scores
 */
export async function identifyPlant(imageUri: string): Promise<IdentificationResponse> {
  try {
    // Get image as base64
    const file = new File(imageUri);
    const base64 = await file.base64();

    console.log('[Plant.id] Image loaded, size:', base64.length, 'chars');

    // Call Plant.id API
    const response = await callPlantIdAPI(base64);

    // Transform results
    const results: PlantIdentificationResult[] = response.suggestions.map(suggestion => ({
      className: suggestion.name,
      displayName: suggestion.details?.common_names?.[0] || suggestion.name,
      confidence: suggestion.probability,
      isPlant: true,
    }));

    // Sort by confidence (highest first)
    results.sort((a, b) => b.confidence - a.confidence);

    const bestMatch = results[0];

    console.log('[Plant.id] Best match:', bestMatch?.displayName, 'with confidence:', bestMatch?.confidence);

    return {
      success: true,
      results,
      bestMatch,
      isOffline: false,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error occurred';
    console.log('[Plant.id] Error:', message);

    // Check for network errors
    if (message.includes('Network request failed') || message.includes('Failed to fetch') || message.includes('network')) {
      return {
        success: false,
        results: [],
        error: 'No internet connection. Please check your network.',
        isOffline: true,
      };
    }

    // Check for API key issues
    if (message.includes('API key')) {
      return {
        success: false,
        results: [],
        error: message,
        isOffline: false,
      };
    }

    // Check for rate limiting
    if (message.includes('limit') || message.includes('429')) {
      return {
        success: false,
        results: [],
        error: 'Daily identification limit reached. Try again tomorrow.',
        isOffline: false,
      };
    }

    return {
      success: false,
      results: [],
      error: `Identification failed: ${message}`,
      isOffline: false,
    };
  }
}

/**
 * Get a user-friendly display name for a result
 */
export function getDisplayName(result: PlantIdentificationResult): string {
  return result.displayName;
}

/**
 * Format confidence as a percentage string
 */
export function formatConfidence(confidence: number): string {
  return `${(confidence * 100).toFixed(1)}%`;
}

/**
 * Preload function (no-op for API-based service)
 */
export async function preloadModel(): Promise<void> {
  // No preloading needed for API-based service
}

/**
 * Check if service is ready
 */
export function isModelReady(): boolean {
  return !!process.env.EXPO_PUBLIC_PLANTID_API_KEY;
}

export default {
  identifyPlant,
  getDisplayName,
  formatConfidence,
  preloadModel,
  isModelReady,
};
