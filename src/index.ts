/**
 * node-it-glue
 * Comprehensive, fully-typed Node.js/TypeScript library for the IT Glue API
 *
 * @packageDocumentation
 */

// Main client
export { ITGlueClient } from './client.js';

// Configuration
export { resolveConfig, getHeaders } from './config.js';
export type { ResolvedConfig } from './config.js';

// HTTP client
export { HttpClient } from './http.js';
export type { RequestOptions } from './http.js';

// JSON:API utilities
export {
  deserialize,
  serialize,
  kebabToCamel,
  camelToKebab,
  convertKeysToCamel,
  convertKeysToKebab,
  buildQueryParams,
  buildFilterParams,
} from './jsonapi.js';

// Rate limiting
export { RateLimiter, retryWithBackoff } from './rate-limiter.js';
export type { RetryConfig } from './rate-limiter.js';

// Pagination
export {
  createPaginatedIterator,
  createPageIterator,
  collectAll,
  take,
  DEFAULT_PAGE_SIZE,
  MAX_PAGE_SIZE,
} from './pagination.js';
export type { PageFetcher, PaginationOptions } from './pagination.js';

// Error classes
export {
  ITGlueError,
  ITGlueAuthenticationError,
  ITGlueNotFoundError,
  ITGlueValidationError,
  ITGlueRateLimitError,
  ITGlueServerError,
  ITGlueNetworkError,
  ITGlueTimeoutError,
  createErrorFromResponse,
} from './errors.js';

// Resources
export {
  BaseResource,
  NestedResource,
  OrganizationsResource,
  OrganizationTypesResource,
  OrganizationStatusesResource,
} from './resources/index.js';
export type { BaseResourceOptions } from './resources/base.js';

// All types
export * from './types/index.js';
