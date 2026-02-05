/**
 * Miscellaneous resources for IT Glue API
 * (Domains, Expirations, Logs, Attachments, Related Items, Exports, Checklists)
 */

import type { HttpClient } from '../http.js';
import type {
  Domain,
  DomainListParams,
  Expiration,
  ExpirationGetParams,
  ExpirationListParams,
  Log,
  LogListParams,
  Attachment,
  AttachmentCreateData,
  AttachmentListParams,
  AttachmentResourceType,
  AttachmentUpdateData,
  RelatedItem,
  RelatedItemCreateData,
  RelatedItemResourceType,
  RelatedItemUpdateData,
  Export,
  ExportCreateData,
  ExportGetParams,
  ExportListParams,
  Checklist,
  ChecklistGetParams,
  ChecklistListParams,
  ChecklistUpdateData,
  AsyncIterableWithHelpers,
  PaginationMeta,
  PaginatedResponse,
} from '../types/index.js';
import { BaseResource } from './base.js';
import { createPaginatedIterator, DEFAULT_PAGE_SIZE } from '../pagination.js';
import { buildFilterParams } from '../jsonapi.js';

/**
 * Domains resource (read-only, nested under organizations)
 */
export class DomainsResource {
  private readonly client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }

  /**
   * Build query parameters for a list request
   */
  private buildListParams(params?: DomainListParams): Record<string, unknown> {
    if (!params) return {};

    const result: Record<string, unknown> = {};
    if (params.filter) {
      result.filter = buildFilterParams(params.filter as unknown as Record<string, unknown>);
    }
    if (params.page) result.page = params.page;
    if (params.sort) result.sort = params.sort;
    if (params.include) result.include = params.include;

    return result;
  }

  /**
   * List domains for an organization
   */
  async listByOrg(
    orgId: string | number,
    params?: DomainListParams
  ): Promise<{ data: Domain[]; meta: PaginationMeta }> {
    const queryParams = this.buildListParams(params);
    return this.client.list<Domain>(
      `/organizations/${orgId}/relationships/domains`,
      queryParams
    );
  }
}

/**
 * Expirations resource
 */
export class ExpirationsResource extends BaseResource<
  Expiration,
  ExpirationListParams,
  ExpirationGetParams,
  never,
  never
> {
  constructor(client: HttpClient) {
    super({
      client,
      basePath: '/expirations',
      type: 'expirations',
    });
  }

  // Expirations cannot be created via API
  override async create(): Promise<never> {
    throw new Error('Expirations cannot be created via API');
  }

  // Expirations cannot be updated via API
  override async update(): Promise<never> {
    throw new Error('Expirations cannot be updated via API');
  }

  // Expirations cannot be deleted via API
  override async delete(): Promise<never> {
    throw new Error('Expirations cannot be deleted via API');
  }
}

/**
 * Logs resource (read-only)
 */
export class LogsResource {
  private readonly client: HttpClient;

  constructor(client: HttpClient) {
    this.client = client;
  }

  /**
   * Build query parameters for a list request
   */
  private buildListParams(params?: LogListParams): Record<string, unknown> {
    if (!params) return {};

    const result: Record<string, unknown> = {};
    if (params.filter) {
      result.filter = buildFilterParams(params.filter as unknown as Record<string, unknown>);
    }
    if (params.page) result.page = params.page;
    if (params.sort) result.sort = params.sort;
    if (params.include) result.include = params.include;

    return result;
  }

  /**
   * List logs
   */
  async list(
    params?: LogListParams
  ): Promise<{ data: Log[]; meta: PaginationMeta }> {
    const queryParams = this.buildListParams(params);
    return this.client.list<Log>('/logs', queryParams);
  }

  /**
   * List all logs with automatic pagination
   */
  listAll(
    params?: Omit<LogListParams, 'page'>
  ): AsyncIterableWithHelpers<Log> {
    const baseParams = this.buildListParams(params as LogListParams);

    return createPaginatedIterator<Log>(
      async (page) => {
        const queryParams = { ...baseParams, page };
        const response = await this.client.list<Log>('/logs', queryParams);
        return response as PaginatedResponse<Log>;
      },
      { pageSize: DEFAULT_PAGE_SIZE }
    );
  }
}

/**
 * Attachments resource (nested under various resource types)
 */
export class AttachmentsResource {
  private readonly client: HttpClient;
  private readonly type = 'attachments';

  constructor(client: HttpClient) {
    this.client = client;
  }

  /**
   * Build query parameters for a list request
   */
  private buildListParams(params?: AttachmentListParams): Record<string, unknown> {
    if (!params) return {};

    const result: Record<string, unknown> = {};
    if (params.filter) {
      result.filter = buildFilterParams(params.filter as unknown as Record<string, unknown>);
    }
    if (params.page) result.page = params.page;
    if (params.sort) result.sort = params.sort;
    if (params.include) result.include = params.include;

    return result;
  }

  /**
   * Build the path for attachments under a resource
   */
  private buildPath(resourceType: AttachmentResourceType, resourceId: string | number): string {
    return `/${resourceType}/${resourceId}/relationships/attachments`;
  }

  /**
   * List attachments for a resource
   */
  async list(
    resourceType: AttachmentResourceType,
    resourceId: string | number,
    params?: AttachmentListParams
  ): Promise<{ data: Attachment[]; meta: PaginationMeta }> {
    const queryParams = this.buildListParams(params);
    return this.client.list<Attachment>(
      this.buildPath(resourceType, resourceId),
      queryParams
    );
  }

  /**
   * Create an attachment for a resource
   */
  async create(
    resourceType: AttachmentResourceType,
    resourceId: string | number,
    data: AttachmentCreateData
  ): Promise<Attachment> {
    return this.client.postAndDeserialize<Attachment>(
      this.buildPath(resourceType, resourceId),
      this.type,
      data as unknown as Record<string, unknown>
    );
  }

  /**
   * Update an attachment
   */
  async update(
    resourceType: AttachmentResourceType,
    resourceId: string | number,
    id: string | number,
    data: AttachmentUpdateData
  ): Promise<Attachment> {
    return this.client.patchAndDeserialize<Attachment>(
      `${this.buildPath(resourceType, resourceId)}/${id}`,
      this.type,
      String(id),
      data as unknown as Record<string, unknown>
    );
  }

  /**
   * Delete an attachment
   */
  async delete(
    resourceType: AttachmentResourceType,
    resourceId: string | number,
    id: string | number
  ): Promise<void> {
    await this.client.delete(`${this.buildPath(resourceType, resourceId)}/${id}`);
  }
}

/**
 * Related Items resource (nested under various resource types)
 */
export class RelatedItemsResource {
  private readonly client: HttpClient;
  private readonly type = 'related-items';

  constructor(client: HttpClient) {
    this.client = client;
  }

  /**
   * Build the path for related items under a resource
   */
  private buildPath(resourceType: RelatedItemResourceType, resourceId: string | number): string {
    return `/${resourceType}/${resourceId}/relationships/related_items`;
  }

  /**
   * Create a related item for a resource
   */
  async create(
    resourceType: RelatedItemResourceType,
    resourceId: string | number,
    data: RelatedItemCreateData
  ): Promise<RelatedItem> {
    return this.client.postAndDeserialize<RelatedItem>(
      this.buildPath(resourceType, resourceId),
      this.type,
      data as unknown as Record<string, unknown>
    );
  }

  /**
   * Update a related item
   */
  async update(
    resourceType: RelatedItemResourceType,
    resourceId: string | number,
    id: string | number,
    data: RelatedItemUpdateData
  ): Promise<RelatedItem> {
    return this.client.patchAndDeserialize<RelatedItem>(
      `${this.buildPath(resourceType, resourceId)}/${id}`,
      this.type,
      String(id),
      data as unknown as Record<string, unknown>
    );
  }

  /**
   * Delete a related item
   */
  async delete(
    resourceType: RelatedItemResourceType,
    resourceId: string | number,
    id: string | number
  ): Promise<void> {
    await this.client.delete(`${this.buildPath(resourceType, resourceId)}/${id}`);
  }
}

/**
 * Exports resource
 */
export class ExportsResource extends BaseResource<
  Export,
  ExportListParams,
  ExportGetParams,
  ExportCreateData,
  never
> {
  constructor(client: HttpClient) {
    super({
      client,
      basePath: '/exports',
      type: 'exports',
    });
  }

  // Exports cannot be updated
  override async update(): Promise<never> {
    throw new Error('Exports cannot be updated via API');
  }
}

/**
 * Checklists resource (nested under organizations)
 */
export class ChecklistsResource {
  private readonly client: HttpClient;
  private readonly type = 'checklists';

  constructor(client: HttpClient) {
    this.client = client;
  }

  /**
   * Build query parameters for a list request
   */
  private buildListParams(params?: ChecklistListParams): Record<string, unknown> {
    if (!params) return {};

    const result: Record<string, unknown> = {};
    if (params.filter) {
      result.filter = buildFilterParams(params.filter as unknown as Record<string, unknown>);
    }
    if (params.page) result.page = params.page;
    if (params.sort) result.sort = params.sort;
    if (params.include) result.include = params.include;

    return result;
  }

  /**
   * Build query parameters for a get request
   */
  private buildGetParams(params?: ChecklistGetParams): Record<string, unknown> {
    if (!params) return {};
    return params as unknown as Record<string, unknown>;
  }

  /**
   * List checklists for an organization
   */
  async listByOrg(
    orgId: string | number,
    params?: ChecklistListParams
  ): Promise<{ data: Checklist[]; meta: PaginationMeta }> {
    const queryParams = this.buildListParams(params);
    return this.client.list<Checklist>(
      `/organizations/${orgId}/relationships/checklists`,
      queryParams
    );
  }

  /**
   * Get a single checklist
   */
  async get(id: string | number, params?: ChecklistGetParams): Promise<Checklist> {
    const queryParams = this.buildGetParams(params);
    return this.client.getOne<Checklist>(`/checklists/${id}`, queryParams);
  }

  /**
   * Update a checklist
   */
  async update(id: string | number, data: ChecklistUpdateData): Promise<Checklist> {
    return this.client.patchAndDeserialize<Checklist>(
      `/checklists/${id}`,
      this.type,
      String(id),
      data as unknown as Record<string, unknown>
    );
  }

  /**
   * Delete a checklist
   */
  async delete(id: string | number): Promise<void> {
    await this.client.delete(`/checklists/${id}`);
  }
}
