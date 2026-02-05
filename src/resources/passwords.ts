/**
 * Passwords resource for IT Glue API
 */

import type { HttpClient } from '../http.js';
import type {
  Password,
  PasswordCreateData,
  PasswordGetParams,
  PasswordListParams,
  PasswordUpdateData,
  PasswordCategory,
  PasswordCategoryCreateData,
  PasswordCategoryListParams,
  PasswordCategoryUpdateData,
  PasswordFolder,
  PasswordFolderCreateData,
  PasswordFolderListParams,
  PasswordFolderUpdateData,
  AsyncIterableWithHelpers,
  PaginationMeta,
  PaginatedResponse,
} from '../types/index.js';
import { BaseResource } from './base.js';
import { createPaginatedIterator, DEFAULT_PAGE_SIZE } from '../pagination.js';
import { buildFilterParams } from '../jsonapi.js';

/**
 * Passwords resource
 */
export class PasswordsResource extends BaseResource<
  Password,
  PasswordListParams,
  PasswordGetParams,
  PasswordCreateData,
  PasswordUpdateData
> {
  constructor(client: HttpClient) {
    super({
      client,
      basePath: '/passwords',
      type: 'passwords',
    });
  }

  /**
   * Build query parameters for a list request
   */
  protected override buildListParams(params?: PasswordListParams): Record<string, unknown> {
    const result = super.buildListParams(params);
    if (params?.showPassword) {
      result['show_password'] = 'true';
    }
    return result;
  }

  /**
   * Build query parameters for a get request
   */
  protected override buildGetParams(params?: PasswordGetParams): Record<string, unknown> {
    const result = super.buildGetParams(params);
    if (params?.showPassword) {
      result['show_password'] = 'true';
    }
    return result;
  }

  /**
   * List passwords for a specific organization
   */
  async listByOrg(
    orgId: string | number,
    params?: PasswordListParams
  ): Promise<{ data: Password[]; meta: PaginationMeta }> {
    const queryParams = this.buildListParams(params);
    return this.client.list<Password>(
      `/organizations/${orgId}/relationships/passwords`,
      queryParams
    );
  }

  /**
   * List all passwords for an organization with automatic pagination
   */
  listAllByOrg(
    orgId: string | number,
    params?: Omit<PasswordListParams, 'page'>
  ): AsyncIterableWithHelpers<Password> {
    const baseParams = this.buildListParams(params as PasswordListParams);

    return createPaginatedIterator<Password>(
      async (page) => {
        const queryParams = { ...baseParams, page };
        const response = await this.client.list<Password>(
          `/organizations/${orgId}/relationships/passwords`,
          queryParams
        );
        return response as PaginatedResponse<Password>;
      },
      { pageSize: DEFAULT_PAGE_SIZE }
    );
  }
}

/**
 * Password Categories resource
 */
export class PasswordCategoriesResource extends BaseResource<
  PasswordCategory,
  PasswordCategoryListParams,
  Record<string, unknown>,
  PasswordCategoryCreateData,
  PasswordCategoryUpdateData
> {
  constructor(client: HttpClient) {
    super({
      client,
      basePath: '/password_categories',
      type: 'password-categories',
    });
  }
}

/**
 * Password Folders resource
 */
export class PasswordFoldersResource {
  private readonly client: HttpClient;
  private readonly type = 'password-folders';

  constructor(client: HttpClient) {
    this.client = client;
  }

  /**
   * Build query parameters for a list request
   */
  private buildListParams(params?: PasswordFolderListParams): Record<string, unknown> {
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
   * List password folders for an organization
   */
  async listByOrg(
    orgId: string | number,
    params?: PasswordFolderListParams
  ): Promise<{ data: PasswordFolder[]; meta: PaginationMeta }> {
    const queryParams = this.buildListParams(params);
    return this.client.list<PasswordFolder>(
      `/organizations/${orgId}/relationships/password_folders`,
      queryParams
    );
  }

  /**
   * Create a password folder
   */
  async create(
    orgId: string | number,
    data: PasswordFolderCreateData
  ): Promise<PasswordFolder> {
    return this.client.postAndDeserialize<PasswordFolder>(
      `/organizations/${orgId}/relationships/password_folders`,
      this.type,
      data as unknown as Record<string, unknown>
    );
  }

  /**
   * Update a password folder
   */
  async update(
    orgId: string | number,
    id: string | number,
    data: PasswordFolderUpdateData
  ): Promise<PasswordFolder> {
    return this.client.patchAndDeserialize<PasswordFolder>(
      `/organizations/${orgId}/relationships/password_folders/${id}`,
      this.type,
      String(id),
      data as unknown as Record<string, unknown>
    );
  }

  /**
   * Delete a password folder
   */
  async delete(orgId: string | number, id: string | number): Promise<void> {
    await this.client.delete(`/organizations/${orgId}/relationships/password_folders/${id}`);
  }
}
