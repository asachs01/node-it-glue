/**
 * Base resource class for IT Glue API resources
 * Provides common CRUD operations that individual resources can extend
 */

import type { HttpClient } from '../http.js';
import type {
  AsyncIterableWithHelpers,
  ListParams,
  PaginatedResponse,
  PaginationMeta,
} from '../types/index.js';
import { buildFilterParams } from '../jsonapi.js';
import { createPaginatedIterator, DEFAULT_PAGE_SIZE } from '../pagination.js';

/**
 * Options for the base resource
 */
export interface BaseResourceOptions {
  /** HTTP client instance */
  client: HttpClient;
  /** Base path for this resource (e.g., '/organizations') */
  basePath: string;
  /** JSON:API type name (e.g., 'organizations') */
  type: string;
}

/**
 * Base class for IT Glue API resources
 * Provides standard CRUD operations
 */
export abstract class BaseResource<
  TResource,
  TListParams extends ListParams = ListParams,
  TGetParams = Record<string, unknown>,
  TCreateData = Record<string, unknown>,
  TUpdateData = Record<string, unknown>
> {
  protected readonly client: HttpClient;
  protected readonly basePath: string;
  protected readonly type: string;

  constructor(options: BaseResourceOptions) {
    this.client = options.client;
    this.basePath = options.basePath;
    this.type = options.type;
  }

  /**
   * Build query parameters for a list request
   */
  protected buildListParams(params?: TListParams): Record<string, unknown> {
    if (!params) {
      return {};
    }

    const result: Record<string, unknown> = {};

    // Handle filter
    if ('filter' in params && params.filter) {
      result.filter = buildFilterParams(params.filter as Record<string, unknown>);
    }

    // Handle pagination
    if (params.page) {
      result.page = params.page;
    }

    // Handle sort
    if (params.sort) {
      result.sort = params.sort;
    }

    // Handle include
    if (params.include) {
      result.include = params.include;
    }

    return result;
  }

  /**
   * Build query parameters for a get request
   */
  protected buildGetParams(params?: TGetParams): Record<string, unknown> {
    if (!params) {
      return {};
    }
    return params as Record<string, unknown>;
  }

  /**
   * List resources with pagination
   */
  async list(
    params?: TListParams
  ): Promise<{ data: TResource[]; meta: PaginationMeta }> {
    const queryParams = this.buildListParams(params);
    return this.client.list<TResource>(this.basePath, queryParams);
  }

  /**
   * List all resources with automatic pagination
   * Returns an async iterable that yields individual resources
   */
  listAll(params?: Omit<TListParams, 'page'>): AsyncIterableWithHelpers<TResource> {
    const baseParams = this.buildListParams(params as TListParams);

    return createPaginatedIterator<TResource>(
      async (page) => {
        const queryParams = {
          ...baseParams,
          page,
        };
        const response = await this.client.list<TResource>(this.basePath, queryParams);
        return {
          data: response.data,
          meta: response.meta,
        } as PaginatedResponse<TResource>;
      },
      { pageSize: DEFAULT_PAGE_SIZE }
    );
  }

  /**
   * Get a single resource by ID
   */
  async get(id: string | number, params?: TGetParams): Promise<TResource> {
    const queryParams = this.buildGetParams(params);
    return this.client.getOne<TResource>(`${this.basePath}/${id}`, queryParams);
  }

  /**
   * Create a new resource
   */
  async create(data: TCreateData): Promise<TResource> {
    return this.client.postAndDeserialize<TResource>(
      this.basePath,
      this.type,
      data as Record<string, unknown>
    );
  }

  /**
   * Update an existing resource
   */
  async update(id: string | number, data: TUpdateData): Promise<TResource> {
    return this.client.patchAndDeserialize<TResource>(
      `${this.basePath}/${id}`,
      this.type,
      String(id),
      data as Record<string, unknown>
    );
  }

  /**
   * Delete a resource
   */
  async delete(id: string | number): Promise<void> {
    await this.client.delete(`${this.basePath}/${id}`);
  }
}

/**
 * Base class for nested resources (e.g., /organizations/:id/relationships/locations)
 */
export abstract class NestedResource<
  TResource,
  TListParams extends ListParams = ListParams,
  TGetParams = Record<string, unknown>,
  TCreateData = Record<string, unknown>,
  TUpdateData = Record<string, unknown>
> extends BaseResource<TResource, TListParams, TGetParams, TCreateData, TUpdateData> {
  /**
   * Build the path for a nested resource
   */
  protected buildNestedPath(parentId: string | number): string {
    return this.basePath.replace(':parentId', String(parentId));
  }

  /**
   * List resources under a parent with pagination
   */
  async listByParent(
    parentId: string | number,
    params?: TListParams
  ): Promise<{ data: TResource[]; meta: PaginationMeta }> {
    const path = this.buildNestedPath(parentId);
    const queryParams = this.buildListParams(params);
    return this.client.list<TResource>(path, queryParams);
  }

  /**
   * List all resources under a parent with automatic pagination
   */
  listAllByParent(
    parentId: string | number,
    params?: Omit<TListParams, 'page'>
  ): AsyncIterableWithHelpers<TResource> {
    const path = this.buildNestedPath(parentId);
    const baseParams = this.buildListParams(params as TListParams);

    return createPaginatedIterator<TResource>(
      async (page) => {
        const queryParams = {
          ...baseParams,
          page,
        };
        const response = await this.client.list<TResource>(path, queryParams);
        return {
          data: response.data,
          meta: response.meta,
        } as PaginatedResponse<TResource>;
      },
      { pageSize: DEFAULT_PAGE_SIZE }
    );
  }

  /**
   * Create a resource under a parent
   */
  async createUnderParent(
    parentId: string | number,
    data: TCreateData
  ): Promise<TResource> {
    const path = this.buildNestedPath(parentId);
    return this.client.postAndDeserialize<TResource>(
      path,
      this.type,
      data as Record<string, unknown>
    );
  }

  /**
   * Update a resource under a parent
   */
  async updateUnderParent(
    parentId: string | number,
    id: string | number,
    data: TUpdateData
  ): Promise<TResource> {
    const path = `${this.buildNestedPath(parentId)}/${id}`;
    return this.client.patchAndDeserialize<TResource>(
      path,
      this.type,
      String(id),
      data as Record<string, unknown>
    );
  }

  /**
   * Delete a resource under a parent
   */
  async deleteUnderParent(parentId: string | number, id: string | number): Promise<void> {
    const path = `${this.buildNestedPath(parentId)}/${id}`;
    await this.client.delete(path);
  }
}
