/**
 * Types for IT Glue Users resource
 */

import type { BaseResource, FilterOperators, ListParams, RelationshipLink } from './common.js';

/**
 * User resource
 */
export interface User extends BaseResource {
  type: 'users';
  name?: string;
  firstName?: string;
  lastName?: string;
  email: string;
  roleId?: number;
  roleName?: string;
  salesforceId?: string;
  invitation?: {
    accepted?: boolean;
    sentAt?: string;
    acceptedAt?: string;
  };
  myGlue?: {
    enabled?: boolean;
  };
  currentSignInAt?: string;
  currentSignInIp?: string;
  lastSignInAt?: string;
  lastSignInIp?: string;
  dailyDigest?: boolean;
  weeklyDigest?: boolean;
  relationships?: {
    groups?: RelationshipLink[];
  };
}

/**
 * Filter options for listing users
 */
export interface UserFilter {
  /** Filter by user ID */
  id?: number | number[];
  /** Filter by name */
  name?: string;
  /** Filter by email */
  email?: string;
  /** Filter by role ID */
  roleId?: number;
  /** Exclude specific user IDs */
  excludeId?: number | number[];
  /** Filter by creation date */
  createdAt?: string | FilterOperators<string>;
  /** Filter by update date */
  updatedAt?: string | FilterOperators<string>;
}

/**
 * Parameters for listing users
 */
export interface UserListParams extends ListParams {
  filter?: UserFilter;
}

/**
 * Parameters for getting a single user
 */
export interface UserGetParams {
  /** Related resources to include */
  include?: string;
}

/**
 * Data for updating a user
 */
export interface UserUpdateData {
  firstName?: string;
  lastName?: string;
  roleId?: number;
  dailyDigest?: boolean;
  weeklyDigest?: boolean;
}

/**
 * Data for bulk updating users
 */
export interface UserBulkUpdateData {
  data: Array<{
    id: number;
    type: 'users';
    attributes: UserUpdateData;
  }>;
}

/**
 * User Metrics resource
 */
export interface UserMetric extends BaseResource {
  type: 'user-metrics';
  userId: number;
  resourceType: string;
  date: string;
  created: number;
  viewed: number;
  edited: number;
  deleted: number;
  generated: number;
  copied: number;
}

/**
 * Filter options for listing user metrics
 */
export interface UserMetricFilter {
  /** Filter by user ID - REQUIRED */
  userId: number;
  /** Filter by resource type */
  resourceType?: string;
  /** Filter by date - REQUIRED */
  date?: string;
  /** Filter by date range */
  dateRange?: {
    start: string;
    end: string;
  };
  /** Filter by organization ID */
  organizationId?: number;
}

/**
 * Parameters for listing user metrics
 */
export interface UserMetricListParams extends ListParams {
  filter: UserMetricFilter;
}

/**
 * Group resource
 */
export interface Group extends BaseResource {
  type: 'groups';
  name: string;
  description?: string;
  default?: boolean;
  relationships?: {
    users?: RelationshipLink[];
  };
}

/**
 * Filter options for listing groups
 */
export interface GroupFilter {
  /** Filter by group ID */
  id?: number | number[];
  /** Filter by name */
  name?: string;
  /** Exclude specific group IDs */
  excludeId?: number | number[];
}

/**
 * Parameters for listing groups
 */
export interface GroupListParams extends ListParams {
  filter?: GroupFilter;
}

/**
 * Parameters for getting a single group
 */
export interface GroupGetParams {
  /** Related resources to include */
  include?: string;
}

/**
 * Data for creating a group
 */
export interface GroupCreateData {
  name: string;
  description?: string;
}

/**
 * Data for updating a group
 */
export interface GroupUpdateData {
  name?: string;
  description?: string;
}
