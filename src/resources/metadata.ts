/**
 * Metadata resources for IT Glue API
 * (Manufacturers, Models, Platforms, Operating Systems, Countries, Regions)
 */

import type { HttpClient } from '../http.js';
import type {
  Manufacturer,
  ManufacturerCreateData,
  ManufacturerGetParams,
  ManufacturerListParams,
  ManufacturerUpdateData,
  Model,
  ModelCreateData,
  ModelListParams,
  ModelUpdateData,
  Platform,
  PlatformListParams,
  OperatingSystem,
  OperatingSystemListParams,
  Country,
  CountryGetParams,
  CountryListParams,
  Region,
  RegionListParams,
  PaginationMeta,
} from '../types/index.js';
import { BaseResource } from './base.js';
import { buildFilterParams } from '../jsonapi.js';

/**
 * Manufacturers resource
 */
export class ManufacturersResource extends BaseResource<
  Manufacturer,
  ManufacturerListParams,
  ManufacturerGetParams,
  ManufacturerCreateData,
  ManufacturerUpdateData
> {
  constructor(client: HttpClient) {
    super({
      client,
      basePath: '/manufacturers',
      type: 'manufacturers',
    });
  }

  // Manufacturers cannot be deleted via API
  override async delete(): Promise<never> {
    throw new Error('Manufacturers cannot be deleted via API');
  }
}

/**
 * Models resource
 */
export class ModelsResource {
  private readonly client: HttpClient;
  private readonly type = 'models';

  constructor(client: HttpClient) {
    this.client = client;
  }

  /**
   * Build query parameters for a list request
   */
  private buildListParams(params?: ModelListParams): Record<string, unknown> {
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
   * List models for a manufacturer
   */
  async listByManufacturer(
    mfgId: string | number,
    params?: ModelListParams
  ): Promise<{ data: Model[]; meta: PaginationMeta }> {
    const queryParams = this.buildListParams(params);
    return this.client.list<Model>(
      `/manufacturers/${mfgId}/relationships/models`,
      queryParams
    );
  }

  /**
   * Create a model
   */
  async create(data: ModelCreateData): Promise<Model> {
    return this.client.postAndDeserialize<Model>(
      '/models',
      this.type,
      data as unknown as Record<string, unknown>
    );
  }

  /**
   * Update a model
   */
  async update(id: string | number, data: ModelUpdateData): Promise<Model> {
    return this.client.patchAndDeserialize<Model>(
      `/models/${id}`,
      this.type,
      String(id),
      data as unknown as Record<string, unknown>
    );
  }
}

/**
 * Platforms resource (read-only)
 */
export class PlatformsResource {
  private readonly client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }

  /**
   * Build query parameters for a list request
   */
  private buildListParams(params?: PlatformListParams): Record<string, unknown> {
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
   * List platforms
   */
  async list(
    params?: PlatformListParams
  ): Promise<{ data: Platform[]; meta: PaginationMeta }> {
    const queryParams = this.buildListParams(params);
    return this.client.list<Platform>('/platforms', queryParams);
  }
}

/**
 * Operating Systems resource (read-only)
 */
export class OperatingSystemsResource {
  private readonly client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }

  /**
   * Build query parameters for a list request
   */
  private buildListParams(params?: OperatingSystemListParams): Record<string, unknown> {
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
   * List operating systems
   */
  async list(
    params?: OperatingSystemListParams
  ): Promise<{ data: OperatingSystem[]; meta: PaginationMeta }> {
    const queryParams = this.buildListParams(params);
    return this.client.list<OperatingSystem>('/operating_systems', queryParams);
  }
}

/**
 * Countries resource (read-only)
 */
export class CountriesResource extends BaseResource<
  Country,
  CountryListParams,
  CountryGetParams,
  never,
  never
> {
  constructor(client: HttpClient) {
    super({
      client,
      basePath: '/countries',
      type: 'countries',
    });
  }

  // Countries cannot be created via API
  override async create(): Promise<never> {
    throw new Error('Countries cannot be created via API');
  }

  // Countries cannot be updated via API
  override async update(): Promise<never> {
    throw new Error('Countries cannot be updated via API');
  }

  // Countries cannot be deleted via API
  override async delete(): Promise<never> {
    throw new Error('Countries cannot be deleted via API');
  }
}

/**
 * Regions resource (read-only, nested under countries)
 */
export class RegionsResource {
  private readonly client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }

  /**
   * Build query parameters for a list request
   */
  private buildListParams(params?: RegionListParams): Record<string, unknown> {
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
   * List regions for a country
   */
  async listByCountry(
    countryId: string | number,
    params?: RegionListParams
  ): Promise<{ data: Region[]; meta: PaginationMeta }> {
    const queryParams = this.buildListParams(params);
    return this.client.list<Region>(
      `/countries/${countryId}/relationships/regions`,
      queryParams
    );
  }
}
