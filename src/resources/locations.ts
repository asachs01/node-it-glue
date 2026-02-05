/**
 * Locations resource for IT Glue API
 */

import type { HttpClient } from '../http.js';
import type {
  Location,
  LocationCreateData,
  LocationGetParams,
  LocationListParams,
  LocationUpdateData,
  AsyncIterableWithHelpers,
  PaginationMeta,
  PaginatedResponse,
} from '../types/index.js';
import { BaseResource } from './base.js';
import { createPaginatedIterator, DEFAULT_PAGE_SIZE } from '../pagination.js';

/**
 * Locations resource
 */
export class LocationsResource extends BaseResource<
  Location,
  LocationListParams,
  LocationGetParams,
  LocationCreateData,
  LocationUpdateData
> {
  constructor(client: HttpClient) {
    super({
      client,
      basePath: '/locations',
      type: 'locations',
    });
  }

  /**
   * List locations for a specific organization
   */
  async listByOrg(
    orgId: string | number,
    params?: LocationListParams
  ): Promise<{ data: Location[]; meta: PaginationMeta }> {
    const queryParams = this.buildListParams(params);
    return this.client.list<Location>(
      `/organizations/${orgId}/relationships/locations`,
      queryParams
    );
  }

  /**
   * List all locations for an organization with automatic pagination
   */
  listAllByOrg(
    orgId: string | number,
    params?: Omit<LocationListParams, 'page'>
  ): AsyncIterableWithHelpers<Location> {
    const baseParams = this.buildListParams(params as LocationListParams);

    return createPaginatedIterator<Location>(
      async (page) => {
        const queryParams = { ...baseParams, page };
        const response = await this.client.list<Location>(
          `/organizations/${orgId}/relationships/locations`,
          queryParams
        );
        return response as PaginatedResponse<Location>;
      },
      { pageSize: DEFAULT_PAGE_SIZE }
    );
  }
}
