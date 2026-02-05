/**
 * Documents resource for IT Glue API
 */

import type { HttpClient } from '../http.js';
import type {
  Document,
  DocumentCreateData,
  DocumentGetParams,
  DocumentListParams,
  DocumentUpdateData,
  DocumentSection,
  DocumentSectionCreateData,
  DocumentSectionListParams,
  DocumentSectionUpdateData,
  DocumentImage,
  DocumentImageCreateData,
  DocumentImageListParams,
  AsyncIterableWithHelpers,
  PaginationMeta,
  PaginatedResponse,
} from '../types/index.js';
import { BaseResource } from './base.js';
import { createPaginatedIterator, DEFAULT_PAGE_SIZE } from '../pagination.js';
import { buildFilterParams } from '../jsonapi.js';

/**
 * Documents resource
 */
export class DocumentsResource extends BaseResource<
  Document,
  DocumentListParams,
  DocumentGetParams,
  DocumentCreateData,
  DocumentUpdateData
> {
  constructor(client: HttpClient) {
    super({
      client,
      basePath: '/documents',
      type: 'documents',
    });
  }

  /**
   * List documents for a specific organization
   */
  async listByOrg(
    orgId: string | number,
    params?: DocumentListParams
  ): Promise<{ data: Document[]; meta: PaginationMeta }> {
    const queryParams = this.buildListParams(params);
    return this.client.list<Document>(
      `/organizations/${orgId}/relationships/documents`,
      queryParams
    );
  }

  /**
   * List all documents for an organization with automatic pagination
   */
  listAllByOrg(
    orgId: string | number,
    params?: Omit<DocumentListParams, 'page'>
  ): AsyncIterableWithHelpers<Document> {
    const baseParams = this.buildListParams(params as DocumentListParams);

    return createPaginatedIterator<Document>(
      async (page) => {
        const queryParams = { ...baseParams, page };
        const response = await this.client.list<Document>(
          `/organizations/${orgId}/relationships/documents`,
          queryParams
        );
        return response as PaginatedResponse<Document>;
      },
      { pageSize: DEFAULT_PAGE_SIZE }
    );
  }

  /**
   * Publish a document
   */
  async publish(id: string | number): Promise<Document> {
    return this.client.patchAndDeserialize<Document>(
      `${this.basePath}/${id}/publish`,
      this.type,
      String(id),
      {}
    );
  }
}

/**
 * Document Sections resource
 */
export class DocumentSectionsResource {
  private readonly client: HttpClient;
  private readonly type = 'document-sections';

  constructor(client: HttpClient) {
    this.client = client;
  }

  /**
   * Build query parameters for a list request
   */
  private buildListParams(params?: DocumentSectionListParams): Record<string, unknown> {
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
   * List sections for a document
   */
  async listByDoc(
    docId: string | number,
    params?: DocumentSectionListParams
  ): Promise<{ data: DocumentSection[]; meta: PaginationMeta }> {
    const queryParams = this.buildListParams(params);
    return this.client.list<DocumentSection>(
      `/documents/${docId}/relationships/sections`,
      queryParams
    );
  }

  /**
   * Create a document section
   */
  async create(
    docId: string | number,
    data: DocumentSectionCreateData
  ): Promise<DocumentSection> {
    return this.client.postAndDeserialize<DocumentSection>(
      `/documents/${docId}/relationships/sections`,
      this.type,
      data as unknown as Record<string, unknown>
    );
  }

  /**
   * Update a document section
   */
  async update(
    docId: string | number,
    id: string | number,
    data: DocumentSectionUpdateData
  ): Promise<DocumentSection> {
    return this.client.patchAndDeserialize<DocumentSection>(
      `/documents/${docId}/relationships/sections/${id}`,
      this.type,
      String(id),
      data as unknown as Record<string, unknown>
    );
  }

  /**
   * Delete a document section
   */
  async delete(docId: string | number, id: string | number): Promise<void> {
    await this.client.delete(`/documents/${docId}/relationships/sections/${id}`);
  }
}

/**
 * Document Images resource
 */
export class DocumentImagesResource {
  private readonly client: HttpClient;
  private readonly type = 'document-images';

  constructor(client: HttpClient) {
    this.client = client;
  }

  /**
   * Build query parameters for a list request
   */
  private buildListParams(params?: DocumentImageListParams): Record<string, unknown> {
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
   * List document images
   */
  async list(
    params?: DocumentImageListParams
  ): Promise<{ data: DocumentImage[]; meta: PaginationMeta }> {
    const queryParams = this.buildListParams(params);
    return this.client.list<DocumentImage>('/document_images', queryParams);
  }

  /**
   * Create a document image
   */
  async create(data: DocumentImageCreateData): Promise<DocumentImage> {
    return this.client.postAndDeserialize<DocumentImage>(
      '/document_images',
      this.type,
      data as unknown as Record<string, unknown>
    );
  }

  /**
   * Delete a document image
   */
  async delete(id: string | number): Promise<void> {
    await this.client.delete(`/document_images/${id}`);
  }
}
