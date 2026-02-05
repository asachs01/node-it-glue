/**
 * HTTP client wrapper for IT Glue API
 * Handles request/response processing, rate limiting, and error handling
 */

import type { HttpMethod, JsonApiResponse } from './types/index.js';
import type { ResolvedConfig } from './config.js';
import { getHeaders } from './config.js';
import { RateLimiter, retryWithBackoff } from './rate-limiter.js';
import {
  createErrorFromResponse,
  ITGlueNetworkError,
  ITGlueRateLimitError,
  ITGlueServerError,
  ITGlueTimeoutError,
} from './errors.js';
import { buildQueryParams, deserialize, serialize } from './jsonapi.js';

/**
 * Request options for the HTTP client
 */
export interface RequestOptions {
  /** Query parameters to append to the URL */
  params?: Record<string, unknown>;
  /** Request body (for POST/PATCH) */
  body?: Record<string, unknown>;
  /** Additional headers */
  headers?: Record<string, string>;
  /** Request timeout in milliseconds */
  timeout?: number;
}

/**
 * HTTP client for making IT Glue API requests
 */
export class HttpClient {
  private readonly config: ResolvedConfig;
  private readonly rateLimiter: RateLimiter;

  constructor(config: ResolvedConfig) {
    this.config = config;
    this.rateLimiter = new RateLimiter(config.rateLimiter);
  }

  /**
   * Get the rate limiter instance (for monitoring)
   */
  getRateLimiter(): RateLimiter {
    return this.rateLimiter;
  }

  /**
   * Build the full URL for a request
   */
  private buildUrl(path: string, params?: Record<string, unknown>): string {
    // Ensure path starts with /
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    const url = new URL(`${this.config.baseUrl}${normalizedPath}`);

    // Add query parameters
    if (params) {
      const searchParams = buildQueryParams(params);
      searchParams.forEach((value, key) => {
        url.searchParams.set(key, value);
      });
    }

    return url.toString();
  }

  /**
   * Make an HTTP request with rate limiting and error handling
   */
  async request<T>(
    method: HttpMethod,
    path: string,
    options: RequestOptions = {}
  ): Promise<T> {
    // Wait for rate limiter if needed
    await this.rateLimiter.waitIfNeeded();

    const url = this.buildUrl(path, options.params);
    const timeout = options.timeout ?? this.config.timeout;

    const headers: Record<string, string> = {
      ...getHeaders(this.config.apiKey),
      ...options.headers,
    };

    const requestInit: RequestInit = {
      method,
      headers,
    };

    // Add body for POST/PATCH
    if (options.body && (method === 'POST' || method === 'PATCH')) {
      requestInit.body = JSON.stringify(options.body);
    }

    // Create abort controller for timeout
    const controller = new AbortController();
    requestInit.signal = controller.signal;

    const timeoutId = setTimeout(() => {
      controller.abort();
    }, timeout);

    try {
      // Record the request for rate limiting
      this.rateLimiter.recordRequest();

      const response = await fetch(url, requestInit);
      clearTimeout(timeoutId);

      // Handle errors
      if (!response.ok) {
        const body = await this.safeParseJson(response);
        throw createErrorFromResponse(response.status, body, url, method);
      }

      // Handle 204 No Content (delete operations)
      if (response.status === 204) {
        return undefined as T;
      }

      // Parse successful response
      const data = await response.json();
      return data as T;
    } catch (error) {
      clearTimeout(timeoutId);

      // Re-throw our custom errors
      if (
        error instanceof ITGlueNetworkError ||
        error instanceof ITGlueTimeoutError ||
        error instanceof ITGlueRateLimitError ||
        error instanceof ITGlueServerError
      ) {
        throw error;
      }

      // Handle abort (timeout)
      if (error instanceof DOMException && error.name === 'AbortError') {
        throw new ITGlueTimeoutError(
          `Request timed out after ${timeout}ms`,
          timeout,
          url,
          method
        );
      }

      // Handle network errors
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new ITGlueNetworkError(
          'Network error occurred',
          error,
          url,
          method
        );
      }

      // Re-throw other errors (including our API errors)
      throw error;
    }
  }

  /**
   * Make a request with automatic retry for rate limits and server errors
   */
  async requestWithRetry<T>(
    method: HttpMethod,
    path: string,
    options: RequestOptions = {}
  ): Promise<T> {
    return retryWithBackoff(
      () => this.request<T>(method, path, options),
      {
        maxRetries: this.config.rateLimiter.maxRetries,
        baseDelayMs: this.config.rateLimiter.retryAfterMs,
        maxDelayMs: 60000,
        // Only retry on rate limits and server errors
        shouldRetry: (error: Error) => {
          return error instanceof ITGlueRateLimitError || error instanceof ITGlueServerError;
        },
      }
    );
  }

  /**
   * GET request
   */
  async get<T>(path: string, params?: Record<string, unknown>): Promise<T> {
    return this.requestWithRetry<T>('GET', path, { params });
  }

  /**
   * POST request with JSON:API serialization
   */
  async post<T>(
    path: string,
    type: string,
    data: Record<string, unknown>,
    params?: Record<string, unknown>
  ): Promise<T> {
    const body = serialize(type, data);
    return this.requestWithRetry<T>('POST', path, { body, params });
  }

  /**
   * PATCH request with JSON:API serialization
   */
  async patch<T>(
    path: string,
    type: string,
    id: string,
    data: Record<string, unknown>,
    params?: Record<string, unknown>
  ): Promise<T> {
    const body = serialize(type, data, id);
    return this.requestWithRetry<T>('PATCH', path, { body, params });
  }

  /**
   * DELETE request
   */
  async delete<T = void>(path: string): Promise<T> {
    return this.requestWithRetry<T>('DELETE', path);
  }

  /**
   * Safely parse JSON from a response, returning null on failure
   */
  private async safeParseJson(response: Response): Promise<unknown> {
    try {
      return await response.json();
    } catch {
      return null;
    }
  }

  /**
   * GET request with automatic JSON:API deserialization
   */
  async getAndDeserialize<T>(
    path: string,
    params?: Record<string, unknown>
  ): Promise<{ data: T | T[]; meta?: import('./types/index.js').PaginationMeta; included?: T[] }> {
    const response = await this.get<JsonApiResponse>(path, params);
    return deserialize<T>(response);
  }

  /**
   * GET request for a list with pagination meta
   */
  async list<T>(
    path: string,
    params?: Record<string, unknown>
  ): Promise<{ data: T[]; meta: import('./types/index.js').PaginationMeta }> {
    const response = await this.getAndDeserialize<T>(path, params);
    return {
      data: Array.isArray(response.data) ? response.data : [response.data],
      meta: response.meta || {
        currentPage: 1,
        nextPage: null,
        prevPage: null,
        totalPages: 1,
        totalCount: Array.isArray(response.data) ? response.data.length : 1,
      },
    };
  }

  /**
   * GET request for a single resource
   */
  async getOne<T>(path: string, params?: Record<string, unknown>): Promise<T> {
    const response = await this.getAndDeserialize<T>(path, params);
    if (Array.isArray(response.data)) {
      return response.data[0];
    }
    return response.data;
  }

  /**
   * POST request with automatic deserialization
   */
  async postAndDeserialize<T>(
    path: string,
    type: string,
    data: Record<string, unknown>,
    params?: Record<string, unknown>
  ): Promise<T> {
    const response = await this.post<JsonApiResponse>(path, type, data, params);
    const deserialized = deserialize<T>(response);
    if (Array.isArray(deserialized.data)) {
      return deserialized.data[0];
    }
    return deserialized.data;
  }

  /**
   * PATCH request with automatic deserialization
   */
  async patchAndDeserialize<T>(
    path: string,
    type: string,
    id: string,
    data: Record<string, unknown>,
    params?: Record<string, unknown>
  ): Promise<T> {
    const response = await this.patch<JsonApiResponse>(path, type, id, data, params);
    const deserialized = deserialize<T>(response);
    if (Array.isArray(deserialized.data)) {
      return deserialized.data[0];
    }
    return deserialized.data;
  }
}
