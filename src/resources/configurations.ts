/**
 * Configurations resource for IT Glue API
 */

import type { HttpClient } from '../http.js';
import type {
  Configuration,
  ConfigurationCreateData,
  ConfigurationGetParams,
  ConfigurationListParams,
  ConfigurationUpdateData,
  ConfigurationType,
  ConfigurationTypeCreateData,
  ConfigurationTypeListParams,
  ConfigurationTypeUpdateData,
  ConfigurationStatus,
  ConfigurationStatusCreateData,
  ConfigurationStatusListParams,
  ConfigurationStatusUpdateData,
  ConfigurationInterface,
  ConfigurationInterfaceCreateData,
  ConfigurationInterfaceListParams,
  ConfigurationInterfaceUpdateData,
  AsyncIterableWithHelpers,
  PaginationMeta,
  PaginatedResponse,
} from '../types/index.js';
import { BaseResource } from './base.js';
import { createPaginatedIterator, DEFAULT_PAGE_SIZE } from '../pagination.js';
import { buildFilterParams } from '../jsonapi.js';

/**
 * Configurations resource
 */
export class ConfigurationsResource extends BaseResource<
  Configuration,
  ConfigurationListParams,
  ConfigurationGetParams,
  ConfigurationCreateData,
  ConfigurationUpdateData
> {
  constructor(client: HttpClient) {
    super({
      client,
      basePath: '/configurations',
      type: 'configurations',
    });
  }

  /**
   * List configurations for a specific organization
   */
  async listByOrg(
    orgId: string | number,
    params?: ConfigurationListParams
  ): Promise<{ data: Configuration[]; meta: PaginationMeta }> {
    const queryParams = this.buildListParams(params);
    return this.client.list<Configuration>(
      `/organizations/${orgId}/relationships/configurations`,
      queryParams
    );
  }

  /**
   * List all configurations for an organization with automatic pagination
   */
  listAllByOrg(
    orgId: string | number,
    params?: Omit<ConfigurationListParams, 'page'>
  ): AsyncIterableWithHelpers<Configuration> {
    const baseParams = this.buildListParams(params as ConfigurationListParams);

    return createPaginatedIterator<Configuration>(
      async (page) => {
        const queryParams = { ...baseParams, page };
        const response = await this.client.list<Configuration>(
          `/organizations/${orgId}/relationships/configurations`,
          queryParams
        );
        return response as PaginatedResponse<Configuration>;
      },
      { pageSize: DEFAULT_PAGE_SIZE }
    );
  }
}

/**
 * Configuration Types resource
 */
export class ConfigurationTypesResource extends BaseResource<
  ConfigurationType,
  ConfigurationTypeListParams,
  Record<string, unknown>,
  ConfigurationTypeCreateData,
  ConfigurationTypeUpdateData
> {
  constructor(client: HttpClient) {
    super({
      client,
      basePath: '/configuration_types',
      type: 'configuration-types',
    });
  }
}

/**
 * Configuration Statuses resource
 */
export class ConfigurationStatusesResource extends BaseResource<
  ConfigurationStatus,
  ConfigurationStatusListParams,
  Record<string, unknown>,
  ConfigurationStatusCreateData,
  ConfigurationStatusUpdateData
> {
  constructor(client: HttpClient) {
    super({
      client,
      basePath: '/configuration_statuses',
      type: 'configuration-statuses',
    });
  }
}

/**
 * Configuration Interfaces resource
 */
export class ConfigurationInterfacesResource {
  private readonly client: HttpClient;
  private readonly type = 'configuration-interfaces';

  constructor(client: HttpClient) {
    this.client = client;
  }

  /**
   * Build query parameters for a list request
   */
  private buildListParams(params?: ConfigurationInterfaceListParams): Record<string, unknown> {
    if (!params) return {};

    const result: Record<string, unknown> = {};
    if (params.filter) {
      result.filter = buildFilterParams(params.filter as unknown as Record<string, unknown>);
    }
    if (params.page) result.page = params.page;
    if (params.sort) result.sort = params.sort;
    if (params.include) result.include = params.include;

    return result;
  }

  /**
   * List configuration interfaces for a configuration
   */
  async listByConfig(
    configId: string | number,
    params?: ConfigurationInterfaceListParams
  ): Promise<{ data: ConfigurationInterface[]; meta: PaginationMeta }> {
    const queryParams = this.buildListParams(params);
    return this.client.list<ConfigurationInterface>(
      `/configurations/${configId}/relationships/configuration_interfaces`,
      queryParams
    );
  }

  /**
   * Create a configuration interface
   */
  async create(data: ConfigurationInterfaceCreateData): Promise<ConfigurationInterface> {
    return this.client.postAndDeserialize<ConfigurationInterface>(
      '/configuration_interfaces',
      this.type,
      data as unknown as Record<string, unknown>
    );
  }

  /**
   * Update a configuration interface
   */
  async update(
    id: string | number,
    data: ConfigurationInterfaceUpdateData
  ): Promise<ConfigurationInterface> {
    return this.client.patchAndDeserialize<ConfigurationInterface>(
      `/configuration_interfaces/${id}`,
      this.type,
      String(id),
      data as unknown as Record<string, unknown>
    );
  }

  /**
   * Delete a configuration interface
   */
  async delete(id: string | number): Promise<void> {
    await this.client.delete(`/configuration_interfaces/${id}`);
  }
}
