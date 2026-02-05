/**
 * Types for IT Glue Organizations resource
 */

import type { BaseResource, FilterOperators, ListParams, RelationshipLink } from './common.js';

/**
 * Organization resource
 */
export interface Organization extends BaseResource {
  type: 'organizations';
  name: string;
  alert?: string;
  description?: string;
  organizationTypeId?: number;
  organizationTypeName?: string;
  organizationStatusId?: number;
  organizationStatusName?: string;
  primary?: boolean;
  logo?: string;
  quickNotes?: string;
  shortName?: string;
  relationships?: {
    locations?: RelationshipLink[];
    contacts?: RelationshipLink[];
    configurations?: RelationshipLink[];
    passwords?: RelationshipLink[];
    documents?: RelationshipLink[];
    flexibleAssets?: RelationshipLink[];
  };
}

/**
 * Filter options for listing organizations
 */
export interface OrganizationFilter {
  /** Filter by organization ID */
  id?: number | number[];
  /** Filter by organization name (partial match) */
  name?: string;
  /** Filter by organization type ID */
  organizationTypeId?: number;
  /** Filter by organization status ID */
  organizationStatusId?: number;
  /** Filter by primary flag */
  primary?: boolean;
  /** Exclude specific organization IDs */
  excludeId?: number | number[];
  /** Filter by creation date */
  createdAt?: string | FilterOperators<string>;
  /** Filter by update date */
  updatedAt?: string | FilterOperators<string>;
  /** Filter by PSA integration ID */
  psaId?: string;
  /** Filter by PSA integration type */
  psaIntegrationType?: string;
}

/**
 * Parameters for listing organizations
 */
export interface OrganizationListParams extends ListParams {
  filter?: OrganizationFilter;
}

/**
 * Parameters for getting a single organization
 */
export interface OrganizationGetParams {
  /** Related resources to include */
  include?: string;
}

/**
 * Data for creating a new organization
 */
export interface OrganizationCreateData {
  name: string;
  alert?: string;
  description?: string;
  organizationTypeId?: number;
  organizationStatusId?: number;
  quickNotes?: string;
  shortName?: string;
}

/**
 * Data for updating an organization
 */
export interface OrganizationUpdateData {
  name?: string;
  alert?: string;
  description?: string;
  organizationTypeId?: number;
  organizationStatusId?: number;
  quickNotes?: string;
  shortName?: string;
}

/**
 * Organization Type resource
 */
export interface OrganizationType extends BaseResource {
  type: 'organization-types';
  name: string;
}

/**
 * Parameters for listing organization types
 */
export interface OrganizationTypeListParams extends ListParams {
  filter?: {
    name?: string;
  };
}

/**
 * Data for creating an organization type
 */
export interface OrganizationTypeCreateData {
  name: string;
}

/**
 * Data for updating an organization type
 */
export interface OrganizationTypeUpdateData {
  name: string;
}

/**
 * Organization Status resource
 */
export interface OrganizationStatus extends BaseResource {
  type: 'organization-statuses';
  name: string;
}

/**
 * Parameters for listing organization statuses
 */
export interface OrganizationStatusListParams extends ListParams {
  filter?: {
    name?: string;
  };
}

/**
 * Data for creating an organization status
 */
export interface OrganizationStatusCreateData {
  name: string;
}

/**
 * Data for updating an organization status
 */
export interface OrganizationStatusUpdateData {
  name: string;
}
