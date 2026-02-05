/**
 * Common types shared across all IT Glue resources
 */

/**
 * IT Glue region identifiers
 */
export type ITGlueRegion = 'us' | 'eu' | 'au';

/**
 * Regional base URLs for the IT Glue API
 */
export const REGION_URLS: Record<ITGlueRegion, string> = {
  us: 'https://api.itglue.com',
  eu: 'https://api.eu.itglue.com',
  au: 'https://api.au.itglue.com',
};

/**
 * Rate limiting configuration
 */
export interface RateLimitConfig {
  /** Enable rate limiting (default: true) */
  enabled: boolean;
  /** Maximum requests per window (default: 3000) */
  maxRequests: number;
  /** Window duration in milliseconds (default: 300000 - 5 minutes) */
  windowMs: number;
  /** Threshold to start throttling (0-1, default: 0.8) */
  throttleThreshold: number;
  /** Delay before retrying after rate limit (default: 5000ms) */
  retryAfterMs: number;
  /** Maximum retry attempts (default: 3) */
  maxRetries: number;
}

/**
 * Default rate limiting configuration
 */
export const DEFAULT_RATE_LIMIT_CONFIG: RateLimitConfig = {
  enabled: true,
  maxRequests: 3000,
  windowMs: 300000, // 5 minutes
  throttleThreshold: 0.8,
  retryAfterMs: 5000,
  maxRetries: 3,
};

/**
 * Client configuration options
 */
export interface ITGlueClientConfig {
  /** IT Glue API key (format: ITG.xxx) */
  apiKey: string;
  /** Region for the API (us, eu, au) - used to determine base URL */
  region?: ITGlueRegion;
  /** Explicit base URL (overrides region) */
  baseUrl?: string;
  /** Request timeout in milliseconds (default: 30000) */
  timeout?: number;
  /** Rate limiting configuration */
  rateLimiter?: Partial<RateLimitConfig>;
  /** Include relationships data by default */
  includeRelationships?: boolean;
}

/**
 * Pagination parameters for list requests
 */
export interface PaginationParams {
  /** Number of results per page (max 1000) */
  size?: number;
  /** Page number (1-indexed) */
  number?: number;
}

/**
 * Base filter operators for comparison
 */
export interface FilterOperators<T> {
  gt?: T;
  gte?: T;
  lt?: T;
  lte?: T;
}

/**
 * Common list parameters for all resources
 */
export interface ListParams {
  /** Pagination options */
  page?: PaginationParams;
  /** Sort field (prefix with - for descending) */
  sort?: string;
  /** Related resources to include (sideload) */
  include?: string;
}

/**
 * JSON:API relationship link
 */
export interface RelationshipLink {
  id: string;
  type: string;
}

/**
 * JSON:API meta information for pagination
 */
export interface PaginationMeta {
  currentPage: number;
  nextPage: number | null;
  prevPage: number | null;
  totalPages: number;
  totalCount: number;
}

/**
 * Generic paginated response from the API
 */
export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
  included?: Record<string, unknown>[];
}

/**
 * Generic single resource response from the API
 */
export interface SingleResponse<T> {
  data: T;
  included?: Record<string, unknown>[];
}

/**
 * HTTP methods supported by the API
 */
export type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE';

/**
 * Raw JSON:API resource structure
 */
export interface JsonApiResource {
  id: string;
  type: string;
  attributes?: Record<string, unknown>;
  relationships?: Record<string, { data: RelationshipLink | RelationshipLink[] | null }>;
}

/**
 * Raw JSON:API response envelope
 */
export interface JsonApiResponse {
  data: JsonApiResource | JsonApiResource[];
  meta?: {
    'current-page'?: number;
    'next-page'?: number | null;
    'prev-page'?: number | null;
    'total-pages'?: number;
    'total-count'?: number;
  };
  included?: JsonApiResource[];
  errors?: JsonApiError[];
}

/**
 * JSON:API error object
 */
export interface JsonApiError {
  id?: string;
  status?: string;
  code?: string;
  title?: string;
  detail?: string;
  source?: {
    pointer?: string;
    parameter?: string;
  };
  meta?: Record<string, unknown>;
}

/**
 * Base resource type with common fields
 */
export interface BaseResource {
  id: string;
  type: string;
  createdAt?: string;
  updatedAt?: string;
  relationships?: Record<string, RelationshipLink[]>;
}

/**
 * Async iterable with utility methods
 */
export interface AsyncIterableWithHelpers<T> extends AsyncIterable<T> {
  /** Collect all items into an array */
  toArray(): Promise<T[]>;
}
