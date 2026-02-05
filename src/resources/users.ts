/**
 * Users resource for IT Glue API
 */

import type { HttpClient } from '../http.js';
import type {
  User,
  UserGetParams,
  UserListParams,
  UserUpdateData,
  UserBulkUpdateData,
  UserMetric,
  UserMetricListParams,
  Group,
  GroupCreateData,
  GroupGetParams,
  GroupListParams,
  GroupUpdateData,
  AsyncIterableWithHelpers,
  PaginationMeta,
  PaginatedResponse,
} from '../types/index.js';
import { BaseResource } from './base.js';
import { createPaginatedIterator, DEFAULT_PAGE_SIZE } from '../pagination.js';
import { buildFilterParams } from '../jsonapi.js';

/**
 * Users resource
 */
export class UsersResource extends BaseResource<
  User,
  UserListParams,
  UserGetParams,
  never,
  UserUpdateData
> {
  constructor(client: HttpClient) {
    super({
      client,
      basePath: '/users',
      type: 'users',
    });
  }

  // Users cannot be created via API, so override to throw
  override async create(): Promise<never> {
    throw new Error('Users cannot be created via API');
  }

  // Users cannot be deleted via API, so override to throw
  override async delete(): Promise<never> {
    throw new Error('Users cannot be deleted via API');
  }

  /**
   * Bulk update users
   */
  async bulkUpdate(data: UserBulkUpdateData): Promise<User[]> {
    const response = await this.client.patch<{ data: { id: string; type: string; attributes: Record<string, unknown> }[] }>(
      '/users',
      'users',
      '0',
      data as unknown as Record<string, unknown>
    );
    // Manual deserialization for bulk response
    return response.data.map((item) => ({
      id: item.id,
      type: 'users',
      ...item.attributes,
    } as User));
  }
}

/**
 * User Metrics resource
 */
export class UserMetricsResource {
  private readonly client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }

  /**
   * Build query parameters for a list request
   */
  private buildListParams(params: UserMetricListParams): Record<string, unknown> {
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
   * List user metrics (requires filter.userId and filter.date)
   */
  async list(
    params: UserMetricListParams
  ): Promise<{ data: UserMetric[]; meta: PaginationMeta }> {
    const queryParams = this.buildListParams(params);
    return this.client.list<UserMetric>('/user_metrics', queryParams);
  }

  /**
   * List all user metrics with automatic pagination
   */
  listAll(
    params: Omit<UserMetricListParams, 'page'>
  ): AsyncIterableWithHelpers<UserMetric> {
    const baseParams = this.buildListParams(params as UserMetricListParams);

    return createPaginatedIterator<UserMetric>(
      async (page) => {
        const queryParams = { ...baseParams, page };
        const response = await this.client.list<UserMetric>('/user_metrics', queryParams);
        return response as PaginatedResponse<UserMetric>;
      },
      { pageSize: DEFAULT_PAGE_SIZE }
    );
  }
}

/**
 * Groups resource
 */
export class GroupsResource extends BaseResource<
  Group,
  GroupListParams,
  GroupGetParams,
  GroupCreateData,
  GroupUpdateData
> {
  constructor(client: HttpClient) {
    super({
      client,
      basePath: '/groups',
      type: 'groups',
    });
  }
}
