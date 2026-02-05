/**
 * Configuration utilities for IT Glue client
 */

import type {
  ITGlueClientConfig,
  ITGlueRegion,
  RateLimitConfig,
} from './types/index.js';
import {
  REGION_URLS,
  DEFAULT_RATE_LIMIT_CONFIG,
} from './types/index.js';

/**
 * Default client configuration values
 */
export const DEFAULT_CONFIG = {
  region: 'us' as ITGlueRegion,
  timeout: 30000,
  includeRelationships: false,
};

/**
 * Validated and normalized client configuration
 */
export interface ResolvedConfig {
  apiKey: string;
  baseUrl: string;
  timeout: number;
  rateLimiter: RateLimitConfig;
  includeRelationships: boolean;
}

/**
 * Validate that the API key has the correct format
 */
export function validateApiKey(apiKey: string | undefined): void {
  if (!apiKey) {
    throw new Error('IT Glue API key is required');
  }

  if (typeof apiKey !== 'string') {
    throw new Error('IT Glue API key must be a string');
  }

  // IT Glue API keys start with "ITG."
  if (!apiKey.startsWith('ITG.')) {
    // Don't throw, just warn - the key format might change in the future
    console.warn(
      'Warning: IT Glue API key does not start with "ITG." - this may be an invalid key format'
    );
  }
}

/**
 * Resolve the base URL from configuration
 */
export function resolveBaseUrl(config: ITGlueClientConfig): string {
  // Explicit base URL takes precedence
  if (config.baseUrl) {
    // Remove trailing slash
    return config.baseUrl.replace(/\/+$/, '');
  }

  // Use region to determine base URL
  const region = config.region || DEFAULT_CONFIG.region;
  const baseUrl = REGION_URLS[region];

  if (!baseUrl) {
    throw new Error(
      `Invalid region "${region}". Valid regions are: ${Object.keys(REGION_URLS).join(', ')}`
    );
  }

  return baseUrl;
}

/**
 * Merge rate limit configuration with defaults
 */
export function resolveRateLimitConfig(
  config?: Partial<RateLimitConfig>
): RateLimitConfig {
  return {
    ...DEFAULT_RATE_LIMIT_CONFIG,
    ...config,
  };
}

/**
 * Validate and resolve the full client configuration
 */
export function resolveConfig(config: ITGlueClientConfig): ResolvedConfig {
  // Validate API key
  validateApiKey(config.apiKey);

  // Resolve base URL
  const baseUrl = resolveBaseUrl(config);

  // Resolve rate limiter config
  const rateLimiter = resolveRateLimitConfig(config.rateLimiter);

  return {
    apiKey: config.apiKey,
    baseUrl,
    timeout: config.timeout ?? DEFAULT_CONFIG.timeout,
    rateLimiter,
    includeRelationships: config.includeRelationships ?? DEFAULT_CONFIG.includeRelationships,
  };
}

/**
 * Get standard headers for IT Glue API requests
 */
export function getHeaders(apiKey: string): Record<string, string> {
  return {
    'x-api-key': apiKey,
    'Content-Type': 'application/vnd.api+json',
    'Accept': 'application/vnd.api+json',
  };
}
