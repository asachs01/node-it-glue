/**
 * Types for IT Glue miscellaneous resources (domains, expirations, logs, attachments, related items, exports, checklists)
 */

import type { BaseResource, FilterOperators, ListParams, RelationshipLink } from './common.js';

/**
 * Domain resource
 */
export interface Domain extends BaseResource {
  type: 'domains';
  organizationId: number;
  organizationName?: string;
  name: string;
  registrarName?: string;
  expirationDate?: string;
  notes?: string;
  relationships?: {
    organization?: RelationshipLink[];
  };
}

/**
 * Parameters for listing domains
 */
export interface DomainListParams extends ListParams {
  filter?: {
    name?: string;
    organizationId?: number;
  };
}

/**
 * Expiration resource
 */
export interface Expiration extends BaseResource {
  type: 'expirations';
  organizationId: number;
  organizationName?: string;
  resourceId: number;
  resourceType: string;
  resourceName?: string;
  description?: string;
  expirationDate: string;
  notificationDate?: string;
  relationships?: {
    organization?: RelationshipLink[];
  };
}

/**
 * Filter options for listing expirations
 */
export interface ExpirationFilter {
  /** Filter by expiration ID */
  id?: number | number[];
  /** Filter by organization ID */
  organizationId?: number;
  /** Filter by resource type */
  resourceType?: string;
  /** Filter by expiration date range */
  expirationDate?: string | FilterOperators<string>;
}

/**
 * Parameters for listing expirations
 */
export interface ExpirationListParams extends ListParams {
  filter?: ExpirationFilter;
}

/**
 * Parameters for getting a single expiration
 */
export interface ExpirationGetParams {
  /** Related resources to include */
  include?: string;
}

/**
 * Log entry resource
 */
export interface Log extends BaseResource {
  type: 'logs';
  userId: number;
  userName?: string;
  organizationId?: number;
  organizationName?: string;
  action: string;
  platform?: string;
  createdAt: string;
  details?: Record<string, unknown>;
}

/**
 * Filter options for listing logs
 */
export interface LogFilter {
  /** Filter by user ID */
  userId?: number;
  /** Filter by organization ID */
  organizationId?: number;
  /** Filter by creation date */
  createdAt?: string | FilterOperators<string>;
}

/**
 * Parameters for listing logs
 */
export interface LogListParams extends ListParams {
  filter?: LogFilter;
}

/**
 * Supported resource types for attachments
 */
export type AttachmentResourceType =
  | 'organizations'
  | 'configurations'
  | 'contacts'
  | 'documents'
  | 'passwords'
  | 'flexible-assets'
  | 'locations';

/**
 * Attachment resource
 */
export interface Attachment extends BaseResource {
  type: 'attachments';
  attachableId: number;
  attachableType: string;
  name?: string;
  size?: number;
  contentType?: string;
  ext?: string;
  downloadUrl?: string;
}

/**
 * Parameters for listing attachments
 */
export interface AttachmentListParams extends ListParams {
  filter?: {
    name?: string;
  };
}

/**
 * Data for creating an attachment
 */
export interface AttachmentCreateData {
  /** Base64-encoded file data */
  data: string;
  /** File name */
  fileName: string;
}

/**
 * Data for updating an attachment
 */
export interface AttachmentUpdateData {
  /** File name */
  fileName?: string;
}

/**
 * Supported resource types for related items
 */
export type RelatedItemResourceType = AttachmentResourceType;

/**
 * Related Item resource
 */
export interface RelatedItem extends BaseResource {
  type: 'related-items';
  resourceId: number;
  resourceType: string;
  destinationId: number;
  destinationType: string;
  notes?: string;
}

/**
 * Data for creating a related item
 */
export interface RelatedItemCreateData {
  destinationId: number;
  destinationType: string;
  notes?: string;
}

/**
 * Data for updating a related item
 */
export interface RelatedItemUpdateData {
  notes?: string;
}

/**
 * Export resource
 */
export interface Export extends BaseResource {
  type: 'exports';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  organizationId?: number;
  organizationIds?: number[];
  includeAttachments?: boolean;
  includePasswords?: boolean;
  downloadUrl?: string;
  errorMessage?: string;
}

/**
 * Filter options for listing exports
 */
export interface ExportFilter {
  /** Filter by export ID */
  id?: number | number[];
  /** Filter by status */
  status?: 'pending' | 'processing' | 'completed' | 'failed';
}

/**
 * Parameters for listing exports
 */
export interface ExportListParams extends ListParams {
  filter?: ExportFilter;
}

/**
 * Parameters for getting a single export
 */
export interface ExportGetParams {
  /** Related resources to include */
  include?: string;
}

/**
 * Data for creating an export
 */
export interface ExportCreateData {
  /** Organization ID to export (null for all) */
  organizationId?: number;
  /** Multiple organization IDs to export */
  organizationIds?: number[];
  /** Include attachments in export */
  includeAttachments?: boolean;
  /** Include passwords in export */
  includePasswords?: boolean;
}

/**
 * Checklist resource
 */
export interface Checklist extends BaseResource {
  type: 'checklists';
  organizationId: number;
  organizationName?: string;
  name: string;
  description?: string;
  checklistTemplateId?: number;
  checklistTemplateName?: string;
  completedAt?: string;
  dueDate?: string;
  items?: ChecklistItem[];
  relationships?: {
    organization?: RelationshipLink[];
    checklistTemplate?: RelationshipLink[];
  };
}

/**
 * Checklist item embedded object
 */
export interface ChecklistItem {
  id?: number;
  name: string;
  position: number;
  completed: boolean;
  completedAt?: string;
  completedByName?: string;
}

/**
 * Filter options for listing checklists
 */
export interface ChecklistFilter {
  /** Filter by checklist ID */
  id?: number | number[];
  /** Filter by name */
  name?: string;
  /** Filter by due date */
  dueDate?: string | FilterOperators<string>;
}

/**
 * Parameters for listing checklists
 */
export interface ChecklistListParams extends ListParams {
  filter?: ChecklistFilter;
}

/**
 * Parameters for getting a single checklist
 */
export interface ChecklistGetParams {
  /** Related resources to include */
  include?: string;
}

/**
 * Data for updating a checklist
 */
export interface ChecklistUpdateData {
  name?: string;
  description?: string;
  dueDate?: string;
  items?: ChecklistItem[];
}
