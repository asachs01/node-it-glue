/**
 * Types for IT Glue Contacts resource
 */

import type { BaseResource, FilterOperators, ListParams, RelationshipLink } from './common.js';

/**
 * Contact resource
 */
export interface Contact extends BaseResource {
  type: 'contacts';
  organizationId: number;
  organizationName?: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  title?: string;
  contactTypeId?: number;
  contactTypeName?: string;
  locationId?: number;
  locationName?: string;
  important?: boolean;
  notes?: string;
  contactEmails?: ContactEmail[];
  contactPhones?: ContactPhone[];
  relationships?: {
    organization?: RelationshipLink[];
    contactType?: RelationshipLink[];
    location?: RelationshipLink[];
    passwords?: RelationshipLink[];
    configurations?: RelationshipLink[];
  };
}

/**
 * Contact email embedded object
 */
export interface ContactEmail {
  value: string;
  primary?: boolean;
  labelName?: string;
  labelType?: 'work' | 'personal' | 'other';
}

/**
 * Contact phone embedded object
 */
export interface ContactPhone {
  value: string;
  primary?: boolean;
  labelName?: string;
  labelType?: 'work' | 'mobile' | 'fax' | 'home' | 'other';
  extension?: string;
}

/**
 * Filter options for listing contacts
 */
export interface ContactFilter {
  /** Filter by contact ID */
  id?: number | number[];
  /** Filter by first name */
  firstName?: string;
  /** Filter by last name */
  lastName?: string;
  /** Filter by title */
  title?: string;
  /** Filter by organization ID */
  organizationId?: number;
  /** Filter by contact type ID */
  contactTypeId?: number;
  /** Filter by important flag */
  important?: boolean;
  /** Filter by PSA ID */
  psaId?: string;
  /** Filter by PSA integration type */
  psaIntegrationType?: string;
  /** Exclude specific contact IDs */
  excludeId?: number | number[];
  /** Filter by creation date */
  createdAt?: string | FilterOperators<string>;
  /** Filter by update date */
  updatedAt?: string | FilterOperators<string>;
}

/**
 * Parameters for listing contacts
 */
export interface ContactListParams extends ListParams {
  filter?: ContactFilter;
}

/**
 * Parameters for getting a single contact
 */
export interface ContactGetParams {
  /** Related resources to include */
  include?: string;
}

/**
 * Data for creating a new contact
 */
export interface ContactCreateData {
  organizationId: number;
  firstName?: string;
  lastName?: string;
  title?: string;
  contactTypeId?: number;
  locationId?: number;
  important?: boolean;
  notes?: string;
  contactEmails?: ContactEmail[];
  contactPhones?: ContactPhone[];
}

/**
 * Data for updating a contact
 */
export interface ContactUpdateData {
  organizationId?: number;
  firstName?: string;
  lastName?: string;
  title?: string;
  contactTypeId?: number;
  locationId?: number;
  important?: boolean;
  notes?: string;
  contactEmails?: ContactEmail[];
  contactPhones?: ContactPhone[];
}

/**
 * Contact Type resource
 */
export interface ContactType extends BaseResource {
  type: 'contact-types';
  name: string;
}

/**
 * Parameters for listing contact types
 */
export interface ContactTypeListParams extends ListParams {
  filter?: {
    name?: string;
  };
}

/**
 * Data for creating a contact type
 */
export interface ContactTypeCreateData {
  name: string;
}

/**
 * Data for updating a contact type
 */
export interface ContactTypeUpdateData {
  name: string;
}
