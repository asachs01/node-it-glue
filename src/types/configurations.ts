/**
 * Types for IT Glue Configurations (Assets) resource
 */

import type { BaseResource, FilterOperators, ListParams, RelationshipLink } from './common.js';

/**
 * Configuration (Asset) resource
 */
export interface Configuration extends BaseResource {
  type: 'configurations';
  organizationId: number;
  organizationName?: string;
  name: string;
  hostname?: string;
  primaryIp?: string;
  macAddress?: string;
  defaultGateway?: string;
  serialNumber?: string;
  assetTag?: string;
  position?: string;
  installedBy?: string;
  purchasedBy?: string;
  purchasedAt?: string;
  warrantyExpiresAt?: string;
  installedAt?: string;
  notes?: string;
  archived?: boolean;
  configurationTypeId?: number;
  configurationTypeName?: string;
  configurationStatusId?: number;
  configurationStatusName?: string;
  manufacturerId?: number;
  manufacturerName?: string;
  modelId?: number;
  modelName?: string;
  operatingSystemId?: number;
  operatingSystemName?: string;
  operatingSystemNotes?: string;
  locationId?: number;
  locationName?: string;
  contactId?: number;
  contactName?: string;
  rmm?: {
    id?: number;
    name?: string;
  };
  relationships?: {
    organization?: RelationshipLink[];
    configurationType?: RelationshipLink[];
    configurationStatus?: RelationshipLink[];
    configurationInterfaces?: RelationshipLink[];
    manufacturer?: RelationshipLink[];
    model?: RelationshipLink[];
    operatingSystem?: RelationshipLink[];
    location?: RelationshipLink[];
    contact?: RelationshipLink[];
  };
}

/**
 * Filter options for listing configurations
 */
export interface ConfigurationFilter {
  /** Filter by configuration ID */
  id?: number | number[];
  /** Filter by name */
  name?: string;
  /** Filter by organization ID */
  organizationId?: number;
  /** Filter by configuration type ID */
  configurationTypeId?: number;
  /** Filter by configuration status ID */
  configurationStatusId?: number;
  /** Filter by contact ID */
  contactId?: number;
  /** Filter by serial number */
  serialNumber?: string;
  /** Filter by asset tag */
  assetTag?: string;
  /** Filter by hostname */
  hostname?: string;
  /** Filter by primary IP */
  primaryIp?: string;
  /** Filter by MAC address */
  macAddress?: string;
  /** Filter by manufacturer ID */
  manufacturerId?: number;
  /** Filter by model ID */
  modelId?: number;
  /** Filter by archived status */
  archived?: boolean;
  /** Filter by RMM ID */
  rmmId?: number;
  /** Filter by RMM integration type */
  rmmIntegrationType?: string;
  /** Filter by PSA ID */
  psaId?: string;
  /** Filter by PSA integration type */
  psaIntegrationType?: string;
  /** Exclude specific configuration IDs */
  excludeId?: number | number[];
  /** Filter by creation date */
  createdAt?: string | FilterOperators<string>;
  /** Filter by update date */
  updatedAt?: string | FilterOperators<string>;
}

/**
 * Parameters for listing configurations
 */
export interface ConfigurationListParams extends ListParams {
  filter?: ConfigurationFilter;
}

/**
 * Parameters for getting a single configuration
 */
export interface ConfigurationGetParams {
  /** Related resources to include */
  include?: string;
}

/**
 * Data for creating a new configuration
 */
export interface ConfigurationCreateData {
  organizationId: number;
  name: string;
  configurationTypeId: number;
  configurationStatusId?: number;
  hostname?: string;
  primaryIp?: string;
  macAddress?: string;
  defaultGateway?: string;
  serialNumber?: string;
  assetTag?: string;
  position?: string;
  installedBy?: string;
  purchasedBy?: string;
  purchasedAt?: string;
  warrantyExpiresAt?: string;
  installedAt?: string;
  notes?: string;
  archived?: boolean;
  manufacturerId?: number;
  modelId?: number;
  operatingSystemId?: number;
  operatingSystemNotes?: string;
  locationId?: number;
  contactId?: number;
}

/**
 * Data for updating a configuration
 */
export interface ConfigurationUpdateData {
  organizationId?: number;
  name?: string;
  configurationTypeId?: number;
  configurationStatusId?: number;
  hostname?: string;
  primaryIp?: string;
  macAddress?: string;
  defaultGateway?: string;
  serialNumber?: string;
  assetTag?: string;
  position?: string;
  installedBy?: string;
  purchasedBy?: string;
  purchasedAt?: string;
  warrantyExpiresAt?: string;
  installedAt?: string;
  notes?: string;
  archived?: boolean;
  manufacturerId?: number;
  modelId?: number;
  operatingSystemId?: number;
  operatingSystemNotes?: string;
  locationId?: number;
  contactId?: number;
}

/**
 * Configuration Type resource
 */
export interface ConfigurationType extends BaseResource {
  type: 'configuration-types';
  name: string;
}

/**
 * Parameters for listing configuration types
 */
export interface ConfigurationTypeListParams extends ListParams {
  filter?: {
    name?: string;
  };
}

/**
 * Data for creating a configuration type
 */
export interface ConfigurationTypeCreateData {
  name: string;
}

/**
 * Data for updating a configuration type
 */
export interface ConfigurationTypeUpdateData {
  name: string;
}

/**
 * Configuration Status resource
 */
export interface ConfigurationStatus extends BaseResource {
  type: 'configuration-statuses';
  name: string;
}

/**
 * Parameters for listing configuration statuses
 */
export interface ConfigurationStatusListParams extends ListParams {
  filter?: {
    name?: string;
  };
}

/**
 * Data for creating a configuration status
 */
export interface ConfigurationStatusCreateData {
  name: string;
}

/**
 * Data for updating a configuration status
 */
export interface ConfigurationStatusUpdateData {
  name: string;
}

/**
 * Configuration Interface resource
 */
export interface ConfigurationInterface extends BaseResource {
  type: 'configuration-interfaces';
  configurationId: number;
  name?: string;
  ipAddress?: string;
  macAddress?: string;
  primary?: boolean;
  notes?: string;
}

/**
 * Parameters for listing configuration interfaces
 */
export interface ConfigurationInterfaceListParams extends ListParams {
  filter?: {
    ipAddress?: string;
  };
}

/**
 * Data for creating a configuration interface
 */
export interface ConfigurationInterfaceCreateData {
  configurationId: number;
  name?: string;
  ipAddress?: string;
  macAddress?: string;
  primary?: boolean;
  notes?: string;
}

/**
 * Data for updating a configuration interface
 */
export interface ConfigurationInterfaceUpdateData {
  name?: string;
  ipAddress?: string;
  macAddress?: string;
  primary?: boolean;
  notes?: string;
}
