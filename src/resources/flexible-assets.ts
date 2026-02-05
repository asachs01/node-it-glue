/**
 * Flexible Assets resource for IT Glue API
 */

import type { HttpClient } from '../http.js';
import type {
  FlexibleAssetType,
  FlexibleAssetTypeCreateData,
  FlexibleAssetTypeGetParams,
  FlexibleAssetTypeListParams,
  FlexibleAssetTypeUpdateData,
  FlexibleAssetField,
  FlexibleAssetFieldCreateData,
  FlexibleAssetFieldListParams,
  FlexibleAssetFieldUpdateData,
  FlexibleAsset,
  FlexibleAssetCreateData,
  FlexibleAssetGetParams,
  FlexibleAssetListParams,
  FlexibleAssetUpdateData,
  AsyncIterableWithHelpers,
  PaginationMeta,
  PaginatedResponse,
} from '../types/index.js';
import { BaseResource } from './base.js';
import { createPaginatedIterator, DEFAULT_PAGE_SIZE } from '../pagination.js';
import { buildFilterParams } from '../jsonapi.js';

/**
 * Flexible Asset Types resource
 */
export class FlexibleAssetTypesResource extends BaseResource<
  FlexibleAssetType,
  FlexibleAssetTypeListParams,
  FlexibleAssetTypeGetParams,
  FlexibleAssetTypeCreateData,
  FlexibleAssetTypeUpdateData
> {
  constructor(client: HttpClient) {
    super({
      client,
      basePath: '/flexible_asset_types',
      type: 'flexible-asset-types',
    });
  }
}

/**
 * Flexible Asset Fields resource
 */
export class FlexibleAssetFieldsResource {
  private readonly client: HttpClient;
  private readonly type = 'flexible-asset-fields';

  constructor(client: HttpClient) {
    this.client = client;
  }

  /**
   * Build query parameters for a list request
   */
  private buildListParams(params?: FlexibleAssetFieldListParams): Record<string, unknown> {
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
   * List flexible asset fields for a type
   */
  async listByType(
    typeId: string | number,
    params?: FlexibleAssetFieldListParams
  ): Promise<{ data: FlexibleAssetField[]; meta: PaginationMeta }> {
    const queryParams = this.buildListParams(params);
    return this.client.list<FlexibleAssetField>(
      `/flexible_asset_types/${typeId}/relationships/flexible_asset_fields`,
      queryParams
    );
  }

  /**
   * Create a flexible asset field
   */
  async create(data: FlexibleAssetFieldCreateData): Promise<FlexibleAssetField> {
    return this.client.postAndDeserialize<FlexibleAssetField>(
      '/flexible_asset_fields',
      this.type,
      data as unknown as Record<string, unknown>
    );
  }

  /**
   * Update a flexible asset field
   */
  async update(
    id: string | number,
    data: FlexibleAssetFieldUpdateData
  ): Promise<FlexibleAssetField> {
    return this.client.patchAndDeserialize<FlexibleAssetField>(
      `/flexible_asset_fields/${id}`,
      this.type,
      String(id),
      data as unknown as Record<string, unknown>
    );
  }

  /**
   * Delete a flexible asset field
   */
  async delete(id: string | number): Promise<void> {
    await this.client.delete(`/flexible_asset_fields/${id}`);
  }
}

/**
 * Flexible Assets resource
 */
export class FlexibleAssetsResource extends BaseResource<
  FlexibleAsset,
  FlexibleAssetListParams,
  FlexibleAssetGetParams,
  FlexibleAssetCreateData,
  FlexibleAssetUpdateData
> {
  constructor(client: HttpClient) {
    super({
      client,
      basePath: '/flexible_assets',
      type: 'flexible-assets',
    });
  }

  /**
   * List flexible assets (requires filter.flexibleAssetTypeId)
   */
  override async list(
    params: FlexibleAssetListParams
  ): Promise<{ data: FlexibleAsset[]; meta: PaginationMeta }> {
    return super.list(params);
  }

  /**
   * List all flexible assets with automatic pagination
   */
  override listAll(
    params: Omit<FlexibleAssetListParams, 'page'>
  ): AsyncIterableWithHelpers<FlexibleAsset> {
    const baseParams = this.buildListParams(params as FlexibleAssetListParams);

    return createPaginatedIterator<FlexibleAsset>(
      async (page) => {
        const queryParams = { ...baseParams, page };
        const response = await this.client.list<FlexibleAsset>(this.basePath, queryParams);
        return response as PaginatedResponse<FlexibleAsset>;
      },
      { pageSize: DEFAULT_PAGE_SIZE }
    );
  }
}
