/**
 * IT Glue API Client
 * Main entry point for interacting with the IT Glue API
 */

import type { ITGlueClientConfig } from './types/index.js';
import { resolveConfig, type ResolvedConfig } from './config.js';
import { HttpClient } from './http.js';
import { RateLimiter } from './rate-limiter.js';
import {
  OrganizationsResource,
  OrganizationTypesResource,
  OrganizationStatusesResource,
} from './resources/index.js';

/**
 * IT Glue API Client
 *
 * Provides access to all IT Glue API resources with automatic pagination,
 * rate limiting, and JSON:API handling.
 *
 * @example
 * ```typescript
 * import { ITGlueClient } from 'node-it-glue';
 *
 * const client = new ITGlueClient({
 *   apiKey: 'ITG.xxxxxxxxxxxxxxxx',
 *   region: 'us', // 'us' | 'eu' | 'au'
 * });
 *
 * // List organizations
 * const { data, meta } = await client.organizations.list({
 *   filter: { organizationStatusId: 1 },
 *   page: { size: 50 },
 * });
 *
 * // Auto-paginate through all organizations
 * for await (const org of client.organizations.listAll()) {
 *   console.log(org.name);
 * }
 * ```
 */
export class ITGlueClient {
  private readonly config: ResolvedConfig;
  private readonly http: HttpClient;

  /**
   * Organizations resource
   *
   * @example
   * ```typescript
   * // List organizations
   * const orgs = await client.organizations.list();
   *
   * // Get a single organization
   * const org = await client.organizations.get('12345');
   *
   * // Create an organization
   * const newOrg = await client.organizations.create({
   *   name: 'Acme Corp',
   *   organizationTypeId: 42,
   * });
   *
   * // Update an organization
   * await client.organizations.update('12345', { name: 'Acme Corporation' });
   *
   * // Delete an organization
   * await client.organizations.delete('12345');
   * ```
   */
  public readonly organizations: OrganizationsResource;

  /**
   * Organization Types resource
   *
   * @example
   * ```typescript
   * // List organization types
   * const types = await client.organizationTypes.list();
   *
   * // Create an organization type
   * const newType = await client.organizationTypes.create({ name: 'Customer' });
   * ```
   */
  public readonly organizationTypes: OrganizationTypesResource;

  /**
   * Organization Statuses resource
   *
   * @example
   * ```typescript
   * // List organization statuses
   * const statuses = await client.organizationStatuses.list();
   *
   * // Create an organization status
   * const newStatus = await client.organizationStatuses.create({ name: 'Active' });
   * ```
   */
  public readonly organizationStatuses: OrganizationStatusesResource;

  /**
   * Create a new IT Glue API client
   *
   * @param config - Client configuration options
   * @throws {Error} If the API key is missing or invalid
   */
  constructor(config: ITGlueClientConfig) {
    this.config = resolveConfig(config);
    this.http = new HttpClient(this.config);

    // Initialize resources
    this.organizations = new OrganizationsResource(this.http);
    this.organizationTypes = new OrganizationTypesResource(this.http);
    this.organizationStatuses = new OrganizationStatusesResource(this.http);
  }

  /**
   * Get the resolved configuration
   * Useful for debugging and testing
   */
  getConfig(): Readonly<ResolvedConfig> {
    return { ...this.config };
  }

  /**
   * Get the rate limiter status
   * Useful for monitoring rate limit usage
   *
   * @example
   * ```typescript
   * const status = client.getRateLimitStatus();
   * console.log(`Remaining requests: ${status.remaining}`);
   * ```
   */
  getRateLimitStatus(): ReturnType<RateLimiter['getStatus']> {
    return this.http.getRateLimiter().getStatus();
  }

  /**
   * Get the HTTP client instance
   * For advanced use cases that need direct HTTP access
   */
  getHttpClient(): HttpClient {
    return this.http;
  }
}
