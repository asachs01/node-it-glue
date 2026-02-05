/**
 * Types for IT Glue Documents resource
 */

import type { BaseResource, FilterOperators, ListParams, RelationshipLink } from './common.js';

/**
 * Document resource
 */
export interface Document extends BaseResource {
  type: 'documents';
  organizationId: number;
  organizationName?: string;
  name: string;
  resourceId?: number;
  resourceType?: string;
  published?: boolean;
  pinned?: boolean;
  draft?: boolean;
  relationships?: {
    organization?: RelationshipLink[];
  };
}

/**
 * Filter options for listing documents
 */
export interface DocumentFilter {
  /** Filter by document ID */
  id?: number | number[];
  /** Filter by name */
  name?: string;
  /** Filter by organization ID */
  organizationId?: number;
  /** Filter by published status */
  published?: boolean;
  /** Filter by draft status */
  draft?: boolean;
  /** Exclude specific document IDs */
  excludeId?: number | number[];
  /** Filter by creation date */
  createdAt?: string | FilterOperators<string>;
  /** Filter by update date */
  updatedAt?: string | FilterOperators<string>;
}

/**
 * Parameters for listing documents
 */
export interface DocumentListParams extends ListParams {
  filter?: DocumentFilter;
}

/**
 * Parameters for getting a single document
 */
export interface DocumentGetParams {
  /** Related resources to include */
  include?: string;
}

/**
 * Data for creating a new document
 */
export interface DocumentCreateData {
  organizationId: number;
  name: string;
  content?: string;
  published?: boolean;
}

/**
 * Data for updating a document
 */
export interface DocumentUpdateData {
  name?: string;
  content?: string;
  published?: boolean;
}

/**
 * Document Section resource
 */
export interface DocumentSection extends BaseResource {
  type: 'document-sections';
  documentId: number;
  name?: string;
  content?: string;
  position?: number;
}

/**
 * Parameters for listing document sections
 */
export interface DocumentSectionListParams extends ListParams {
  filter?: {
    name?: string;
  };
}

/**
 * Data for creating a document section
 */
export interface DocumentSectionCreateData {
  name?: string;
  content?: string;
  position?: number;
}

/**
 * Data for updating a document section
 */
export interface DocumentSectionUpdateData {
  name?: string;
  content?: string;
  position?: number;
}

/**
 * Document Image resource
 */
export interface DocumentImage extends BaseResource {
  type: 'document-images';
  name?: string;
  content?: string;
  contentUrl?: string;
  base64Data?: string;
}

/**
 * Parameters for listing document images
 */
export interface DocumentImageListParams extends ListParams {
  filter?: {
    name?: string;
  };
}

/**
 * Data for creating a document image
 */
export interface DocumentImageCreateData {
  /** Base64-encoded image data */
  base64?: string;
  /** Image URL to upload from */
  url?: string;
}
