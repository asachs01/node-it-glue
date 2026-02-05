/**
 * Types for IT Glue Flexible Assets resource
 */

import type { BaseResource, FilterOperators, ListParams, RelationshipLink } from './common.js';

/**
 * Flexible Asset Type resource
 */
export interface FlexibleAssetType extends BaseResource {
  type: 'flexible-asset-types';
  name: string;
  description?: string;
  icon?: string;
  showInMenu?: boolean;
  enabled?: boolean;
  relationships?: {
    flexibleAssetFields?: RelationshipLink[];
  };
}

/**
 * Parameters for listing flexible asset types
 */
export interface FlexibleAssetTypeListParams extends ListParams {
  filter?: {
    name?: string;
    icon?: string;
    enabled?: boolean;
  };
}

/**
 * Parameters for getting a single flexible asset type
 */
export interface FlexibleAssetTypeGetParams {
  /** Related resources to include */
  include?: string;
}

/**
 * Data for creating a flexible asset type
 */
export interface FlexibleAssetTypeCreateData {
  name: string;
  description?: string;
  icon?: string;
  showInMenu?: boolean;
  enabled?: boolean;
}

/**
 * Data for updating a flexible asset type
 */
export interface FlexibleAssetTypeUpdateData {
  name?: string;
  description?: string;
  icon?: string;
  showInMenu?: boolean;
  enabled?: boolean;
}

/**
 * Field kinds for flexible asset fields
 */
export type FlexibleAssetFieldKind =
  | 'Text'
  | 'Textbox'
  | 'Checkbox'
  | 'Number'
  | 'Date'
  | 'Select'
  | 'Header'
  | 'Upload'
  | 'Password'
  | 'Tag'
  | 'Percent';

/**
 * Flexible Asset Field resource
 */
export interface FlexibleAssetField extends BaseResource {
  type: 'flexible-asset-fields';
  flexibleAssetTypeId: number;
  name: string;
  kind: FlexibleAssetFieldKind;
  hint?: string;
  tagType?: string;
  required?: boolean;
  showInList?: boolean;
  useForTitle?: boolean;
  position?: number;
  defaultValue?: string;
  options?: string[];
}

/**
 * Parameters for listing flexible asset fields
 */
export interface FlexibleAssetFieldListParams extends ListParams {
  filter?: {
    name?: string;
  };
}

/**
 * Data for creating a flexible asset field
 */
export interface FlexibleAssetFieldCreateData {
  flexibleAssetTypeId: number;
  name: string;
  kind: FlexibleAssetFieldKind;
  hint?: string;
  tagType?: string;
  required?: boolean;
  showInList?: boolean;
  useForTitle?: boolean;
  position?: number;
  defaultValue?: string;
  options?: string[];
}

/**
 * Data for updating a flexible asset field
 */
export interface FlexibleAssetFieldUpdateData {
  name?: string;
  kind?: FlexibleAssetFieldKind;
  hint?: string;
  tagType?: string;
  required?: boolean;
  showInList?: boolean;
  useForTitle?: boolean;
  position?: number;
  defaultValue?: string;
  options?: string[];
}

/**
 * Flexible Asset resource
 */
export interface FlexibleAsset extends BaseResource {
  type: 'flexible-assets';
  organizationId: number;
  organizationName?: string;
  flexibleAssetTypeId: number;
  flexibleAssetTypeName?: string;
  name?: string;
  archived?: boolean;
  traits: Record<string, unknown>;
  relationships?: {
    organization?: RelationshipLink[];
    flexibleAssetType?: RelationshipLink[];
  };
}

/**
 * Filter options for listing flexible assets
 */
export interface FlexibleAssetFilter {
  /** Filter by flexible asset ID */
  id?: number | number[];
  /** Filter by organization ID - REQUIRED */
  organizationId?: number;
  /** Filter by flexible asset type ID - REQUIRED */
  flexibleAssetTypeId: number;
  /** Filter by name */
  name?: string;
  /** Filter by archived status */
  archived?: boolean;
  /** Exclude specific flexible asset IDs */
  excludeId?: number | number[];
  /** Filter by creation date */
  createdAt?: string | FilterOperators<string>;
  /** Filter by update date */
  updatedAt?: string | FilterOperators<string>;
}

/**
 * Parameters for listing flexible assets
 */
export interface FlexibleAssetListParams extends ListParams {
  filter: FlexibleAssetFilter;
}

/**
 * Parameters for getting a single flexible asset
 */
export interface FlexibleAssetGetParams {
  /** Related resources to include */
  include?: string;
}

/**
 * Data for creating a flexible asset
 */
export interface FlexibleAssetCreateData {
  organizationId: number;
  flexibleAssetTypeId: number;
  traits: Record<string, unknown>;
  archived?: boolean;
}

/**
 * Data for updating a flexible asset
 */
export interface FlexibleAssetUpdateData {
  traits?: Record<string, unknown>;
  archived?: boolean;
}
