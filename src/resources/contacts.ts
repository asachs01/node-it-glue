/**
 * Contacts resource for IT Glue API
 */

import type { HttpClient } from '../http.js';
import type {
  Contact,
  ContactCreateData,
  ContactGetParams,
  ContactListParams,
  ContactUpdateData,
  ContactType,
  ContactTypeCreateData,
  ContactTypeListParams,
  ContactTypeUpdateData,
  AsyncIterableWithHelpers,
  PaginationMeta,
  PaginatedResponse,
} from '../types/index.js';
import { BaseResource } from './base.js';
import { createPaginatedIterator, DEFAULT_PAGE_SIZE } from '../pagination.js';

/**
 * Contacts resource
 */
export class ContactsResource extends BaseResource<
  Contact,
  ContactListParams,
  ContactGetParams,
  ContactCreateData,
  ContactUpdateData
> {
  constructor(client: HttpClient) {
    super({
      client,
      basePath: '/contacts',
      type: 'contacts',
    });
  }

  /**
   * List contacts for a specific organization
   */
  async listByOrg(
    orgId: string | number,
    params?: ContactListParams
  ): Promise<{ data: Contact[]; meta: PaginationMeta }> {
    const queryParams = this.buildListParams(params);
    return this.client.list<Contact>(
      `/organizations/${orgId}/relationships/contacts`,
      queryParams
    );
  }

  /**
   * List all contacts for an organization with automatic pagination
   */
  listAllByOrg(
    orgId: string | number,
    params?: Omit<ContactListParams, 'page'>
  ): AsyncIterableWithHelpers<Contact> {
    const baseParams = this.buildListParams(params as ContactListParams);

    return createPaginatedIterator<Contact>(
      async (page) => {
        const queryParams = { ...baseParams, page };
        const response = await this.client.list<Contact>(
          `/organizations/${orgId}/relationships/contacts`,
          queryParams
        );
        return response as PaginatedResponse<Contact>;
      },
      { pageSize: DEFAULT_PAGE_SIZE }
    );
  }
}

/**
 * Contact Types resource
 */
export class ContactTypesResource extends BaseResource<
  ContactType,
  ContactTypeListParams,
  Record<string, unknown>,
  ContactTypeCreateData,
  ContactTypeUpdateData
> {
  constructor(client: HttpClient) {
    super({
      client,
      basePath: '/contact_types',
      type: 'contact-types',
    });
  }
}
