/**
 * Types for IT Glue Locations resource
 */

import type { BaseResource, FilterOperators, ListParams, RelationshipLink } from './common.js';

/**
 * Location resource
 */
export interface Location extends BaseResource {
  type: 'locations';
  organizationId: number;
  organizationName?: string;
  name: string;
  primary?: boolean;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  postalCode?: string;
  regionId?: number;
  regionName?: string;
  countryId?: number;
  countryName?: string;
  phone?: string;
  fax?: string;
  notes?: string;
  formattedAddress?: string;
  relationships?: {
    organization?: RelationshipLink[];
    region?: RelationshipLink[];
    country?: RelationshipLink[];
  };
}

/**
 * Filter options for listing locations
 */
export interface LocationFilter {
  /** Filter by location ID */
  id?: number | number[];
  /** Filter by name */
  name?: string;
  /** Filter by organization ID */
  organizationId?: number;
  /** Filter by primary flag */
  primary?: boolean;
  /** Filter by city */
  city?: string;
  /** Filter by region ID */
  regionId?: number;
  /** Filter by country ID */
  countryId?: number;
  /** Filter by PSA ID */
  psaId?: string;
  /** Filter by PSA integration type */
  psaIntegrationType?: string;
  /** Exclude specific location IDs */
  excludeId?: number | number[];
  /** Filter by creation date */
  createdAt?: string | FilterOperators<string>;
  /** Filter by update date */
  updatedAt?: string | FilterOperators<string>;
}

/**
 * Parameters for listing locations
 */
export interface LocationListParams extends ListParams {
  filter?: LocationFilter;
}

/**
 * Parameters for getting a single location
 */
export interface LocationGetParams {
  /** Related resources to include */
  include?: string;
}

/**
 * Data for creating a new location
 */
export interface LocationCreateData {
  organizationId: number;
  name: string;
  primary?: boolean;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  postalCode?: string;
  regionId?: number;
  countryId?: number;
  phone?: string;
  fax?: string;
  notes?: string;
}

/**
 * Data for updating a location
 */
export interface LocationUpdateData {
  name?: string;
  primary?: boolean;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  postalCode?: string;
  regionId?: number;
  countryId?: number;
  phone?: string;
  fax?: string;
  notes?: string;
}
