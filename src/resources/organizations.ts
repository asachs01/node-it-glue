/**
 * Organizations resource for IT Glue API
 */

import type { HttpClient } from '../http.js';
import type {
  Organization,
  OrganizationCreateData,
  OrganizationGetParams,
  OrganizationListParams,
  OrganizationUpdateData,
  OrganizationType,
  OrganizationTypeCreateData,
  OrganizationTypeListParams,
  OrganizationTypeUpdateData,
  OrganizationStatus,
  OrganizationStatusCreateData,
  OrganizationStatusListParams,
  OrganizationStatusUpdateData,
  AsyncIterableWithHelpers,
  PaginationMeta,
} from '../types/index.js';
import { BaseResource } from './base.js';

/**
 * Organizations resource
 * Provides CRUD operations for IT Glue organizations
 */
export class OrganizationsResource extends BaseResource<
  Organization,
  OrganizationListParams,
  OrganizationGetParams,
  OrganizationCreateData,
  OrganizationUpdateData
> {
  constructor(client: HttpClient) {
    super({
      client,
      basePath: '/organizations',
      type: 'organizations',
    });
  }

  /**
   * List organizations with optional filtering and pagination
   *
   * @example
   * ```typescript
   * // List all active organizations
   * const { data, meta } = await client.organizations.list({
   *   filter: { organizationStatusId: 1 },
   *   page: { size: 50 },
   * });
   * ```
   */
  async list(
    params?: OrganizationListParams
  ): Promise<{ data: Organization[]; meta: PaginationMeta }> {
    return super.list(params);
  }

  /**
   * List all organizations with automatic pagination
   *
   * @example
   * ```typescript
   * // Iterate through all organizations
   * for await (const org of client.organizations.listAll()) {
   *   console.log(org.name);
   * }
   *
   * // Or collect all into an array
   * const allOrgs = await client.organizations.listAll().toArray();
   * ```
   */
  listAll(
    params?: Omit<OrganizationListParams, 'page'>
  ): AsyncIterableWithHelpers<Organization> {
    return super.listAll(params);
  }

  /**
   * Get a single organization by ID
   *
   * @example
   * ```typescript
   * const org = await client.organizations.get('12345');
   * console.log(org.name);
   * ```
   */
  async get(id: string | number, params?: OrganizationGetParams): Promise<Organization> {
    return super.get(id, params);
  }

  /**
   * Create a new organization
   *
   * @example
   * ```typescript
   * const newOrg = await client.organizations.create({
   *   name: 'Acme Corp',
   *   organizationTypeId: 42,
   *   organizationStatusId: 1,
   * });
   * ```
   */
  async create(data: OrganizationCreateData): Promise<Organization> {
    return super.create(data);
  }

  /**
   * Update an existing organization
   *
   * @example
   * ```typescript
   * const updated = await client.organizations.update('12345', {
   *   name: 'Acme Corporation',
   *   quickNotes: 'Updated notes',
   * });
   * ```
   */
  async update(id: string | number, data: OrganizationUpdateData): Promise<Organization> {
    return super.update(id, data);
  }

  /**
   * Delete an organization
   *
   * @example
   * ```typescript
   * await client.organizations.delete('12345');
   * ```
   */
  async delete(id: string | number): Promise<void> {
    return super.delete(id);
  }
}

/**
 * Organization Types resource
 */
export class OrganizationTypesResource extends BaseResource<
  OrganizationType,
  OrganizationTypeListParams,
  Record<string, unknown>,
  OrganizationTypeCreateData,
  OrganizationTypeUpdateData
> {
  constructor(client: HttpClient) {
    super({
      client,
      basePath: '/organization_types',
      type: 'organization-types',
    });
  }

  /**
   * List organization types
   */
  async list(
    params?: OrganizationTypeListParams
  ): Promise<{ data: OrganizationType[]; meta: PaginationMeta }> {
    return super.list(params);
  }

  /**
   * List all organization types with automatic pagination
   */
  listAll(
    params?: Omit<OrganizationTypeListParams, 'page'>
  ): AsyncIterableWithHelpers<OrganizationType> {
    return super.listAll(params);
  }

  /**
   * Create an organization type
   */
  async create(data: OrganizationTypeCreateData): Promise<OrganizationType> {
    return super.create(data);
  }

  /**
   * Update an organization type
   */
  async update(
    id: string | number,
    data: OrganizationTypeUpdateData
  ): Promise<OrganizationType> {
    return super.update(id, data);
  }
}

/**
 * Organization Statuses resource
 */
export class OrganizationStatusesResource extends BaseResource<
  OrganizationStatus,
  OrganizationStatusListParams,
  Record<string, unknown>,
  OrganizationStatusCreateData,
  OrganizationStatusUpdateData
> {
  constructor(client: HttpClient) {
    super({
      client,
      basePath: '/organization_statuses',
      type: 'organization-statuses',
    });
  }

  /**
   * List organization statuses
   */
  async list(
    params?: OrganizationStatusListParams
  ): Promise<{ data: OrganizationStatus[]; meta: PaginationMeta }> {
    return super.list(params);
  }

  /**
   * List all organization statuses with automatic pagination
   */
  listAll(
    params?: Omit<OrganizationStatusListParams, 'page'>
  ): AsyncIterableWithHelpers<OrganizationStatus> {
    return super.listAll(params);
  }

  /**
   * Create an organization status
   */
  async create(data: OrganizationStatusCreateData): Promise<OrganizationStatus> {
    return super.create(data);
  }

  /**
   * Update an organization status
   */
  async update(
    id: string | number,
    data: OrganizationStatusUpdateData
  ): Promise<OrganizationStatus> {
    return super.update(id, data);
  }
}
