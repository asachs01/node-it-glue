/**
 * Types for IT Glue Passwords resource
 */

import type { BaseResource, FilterOperators, ListParams, RelationshipLink } from './common.js';

/**
 * Password resource
 */
export interface Password extends BaseResource {
  type: 'passwords';
  organizationId: number;
  organizationName?: string;
  name: string;
  username?: string;
  password?: string;
  url?: string;
  notes?: string;
  archived?: boolean;
  passwordCategoryId?: number;
  passwordCategoryName?: string;
  passwordFolderId?: number;
  resourceId?: number;
  resourceType?: string;
  cachedResourceTypeName?: string;
  cachedResourceName?: string;
  passwordUpdatedAt?: string;
  otpEnabled?: boolean;
  otpSecret?: string;
  vaultId?: number;
  vaultName?: string;
  autofillSelectors?: string;
  relationships?: {
    organization?: RelationshipLink[];
    passwordCategory?: RelationshipLink[];
    passwordFolder?: RelationshipLink[];
  };
}

/**
 * Filter options for listing passwords
 */
export interface PasswordFilter {
  /** Filter by password ID */
  id?: number | number[];
  /** Filter by name */
  name?: string;
  /** Filter by organization ID */
  organizationId?: number;
  /** Filter by password category ID */
  passwordCategoryId?: number;
  /** Filter by password folder ID */
  passwordFolderId?: number;
  /** Filter by URL */
  url?: string;
  /** Filter by cached resource name */
  cachedResourceName?: string;
  /** Filter by archived status */
  archived?: boolean;
  /** Exclude specific password IDs */
  excludeId?: number | number[];
  /** Filter by creation date */
  createdAt?: string | FilterOperators<string>;
  /** Filter by update date */
  updatedAt?: string | FilterOperators<string>;
}

/**
 * Parameters for listing passwords
 */
export interface PasswordListParams extends ListParams {
  filter?: PasswordFilter;
  /** Include the password value in the response (requires special permission) */
  showPassword?: boolean;
}

/**
 * Parameters for getting a single password
 */
export interface PasswordGetParams {
  /** Related resources to include */
  include?: string;
  /** Include the password value in the response */
  showPassword?: boolean;
}

/**
 * Data for creating a new password
 */
export interface PasswordCreateData {
  organizationId: number;
  name: string;
  username?: string;
  password?: string;
  url?: string;
  notes?: string;
  passwordCategoryId?: number;
  passwordFolderId?: number;
  resourceId?: number;
  resourceType?: 'Configuration' | 'Contact' | 'Document' | 'Domain' | 'Location' | 'SslCertificate' | 'FlexibleAsset' | 'Ticket';
  archived?: boolean;
  autofillSelectors?: string;
}

/**
 * Data for updating a password
 */
export interface PasswordUpdateData {
  organizationId?: number;
  name?: string;
  username?: string;
  password?: string;
  url?: string;
  notes?: string;
  passwordCategoryId?: number;
  passwordFolderId?: number;
  resourceId?: number;
  resourceType?: 'Configuration' | 'Contact' | 'Document' | 'Domain' | 'Location' | 'SslCertificate' | 'FlexibleAsset' | 'Ticket';
  archived?: boolean;
  autofillSelectors?: string;
}

/**
 * Password Category resource
 */
export interface PasswordCategory extends BaseResource {
  type: 'password-categories';
  name: string;
}

/**
 * Parameters for listing password categories
 */
export interface PasswordCategoryListParams extends ListParams {
  filter?: {
    name?: string;
  };
}

/**
 * Data for creating a password category
 */
export interface PasswordCategoryCreateData {
  name: string;
}

/**
 * Data for updating a password category
 */
export interface PasswordCategoryUpdateData {
  name: string;
}

/**
 * Password Folder resource
 */
export interface PasswordFolder extends BaseResource {
  type: 'password-folders';
  organizationId: number;
  name: string;
  parentFolderId?: number;
}

/**
 * Parameters for listing password folders
 */
export interface PasswordFolderListParams extends ListParams {
  filter?: {
    name?: string;
    parentFolderId?: number;
  };
}

/**
 * Data for creating a password folder
 */
export interface PasswordFolderCreateData {
  name: string;
  parentFolderId?: number;
}

/**
 * Data for updating a password folder
 */
export interface PasswordFolderUpdateData {
  name?: string;
  parentFolderId?: number;
}
