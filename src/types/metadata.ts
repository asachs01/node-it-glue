/**
 * Types for IT Glue metadata resources (manufacturers, models, platforms, operating systems, countries, regions)
 */

import type { BaseResource, ListParams, RelationshipLink } from './common.js';

/**
 * Manufacturer resource
 */
export interface Manufacturer extends BaseResource {
  type: 'manufacturers';
  name: string;
}

/**
 * Filter options for listing manufacturers
 */
export interface ManufacturerFilter {
  /** Filter by manufacturer ID */
  id?: number | number[];
  /** Filter by name */
  name?: string;
}

/**
 * Parameters for listing manufacturers
 */
export interface ManufacturerListParams extends ListParams {
  filter?: ManufacturerFilter;
}

/**
 * Parameters for getting a single manufacturer
 */
export interface ManufacturerGetParams {
  /** Related resources to include */
  include?: string;
}

/**
 * Data for creating a manufacturer
 */
export interface ManufacturerCreateData {
  name: string;
}

/**
 * Data for updating a manufacturer
 */
export interface ManufacturerUpdateData {
  name: string;
}

/**
 * Model resource
 */
export interface Model extends BaseResource {
  type: 'models';
  manufacturerId: number;
  name: string;
  relationships?: {
    manufacturer?: RelationshipLink[];
  };
}

/**
 * Filter options for listing models
 */
export interface ModelFilter {
  /** Filter by model ID */
  id?: number | number[];
  /** Filter by name */
  name?: string;
}

/**
 * Parameters for listing models
 */
export interface ModelListParams extends ListParams {
  filter?: ModelFilter;
}

/**
 * Data for creating a model
 */
export interface ModelCreateData {
  manufacturerId: number;
  name: string;
}

/**
 * Data for updating a model
 */
export interface ModelUpdateData {
  name: string;
}

/**
 * Platform resource
 */
export interface Platform extends BaseResource {
  type: 'platforms';
  name: string;
}

/**
 * Filter options for listing platforms
 */
export interface PlatformFilter {
  /** Filter by name */
  name?: string;
}

/**
 * Parameters for listing platforms
 */
export interface PlatformListParams extends ListParams {
  filter?: PlatformFilter;
}

/**
 * Operating System resource
 */
export interface OperatingSystem extends BaseResource {
  type: 'operating-systems';
  name: string;
  platformId?: number;
  platformName?: string;
  relationships?: {
    platform?: RelationshipLink[];
  };
}

/**
 * Filter options for listing operating systems
 */
export interface OperatingSystemFilter {
  /** Filter by name */
  name?: string;
  /** Filter by platform ID */
  platformId?: number;
}

/**
 * Parameters for listing operating systems
 */
export interface OperatingSystemListParams extends ListParams {
  filter?: OperatingSystemFilter;
}

/**
 * Country resource
 */
export interface Country extends BaseResource {
  type: 'countries';
  name: string;
  iso: string;
  iso3?: string;
  relationships?: {
    regions?: RelationshipLink[];
  };
}

/**
 * Filter options for listing countries
 */
export interface CountryFilter {
  /** Filter by name */
  name?: string;
  /** Filter by ISO code */
  iso?: string;
}

/**
 * Parameters for listing countries
 */
export interface CountryListParams extends ListParams {
  filter?: CountryFilter;
}

/**
 * Parameters for getting a single country
 */
export interface CountryGetParams {
  /** Related resources to include */
  include?: string;
}

/**
 * Region resource
 */
export interface Region extends BaseResource {
  type: 'regions';
  countryId: number;
  name: string;
  iso?: string;
  relationships?: {
    country?: RelationshipLink[];
  };
}

/**
 * Filter options for listing regions
 */
export interface RegionFilter {
  /** Filter by name */
  name?: string;
  /** Filter by ISO code */
  iso?: string;
}

/**
 * Parameters for listing regions
 */
export interface RegionListParams extends ListParams {
  filter?: RegionFilter;
}
