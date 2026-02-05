/**
 * Pagination utilities for IT Glue API
 * Provides async iterators for automatic pagination
 */

import type {
  AsyncIterableWithHelpers,
  PaginatedResponse,
  PaginationMeta,
  PaginationParams,
} from './types/index.js';

/**
 * Function type for fetching a single page of results
 */
export type PageFetcher<T> = (page: PaginationParams) => Promise<PaginatedResponse<T>>;

/**
 * Default page size for pagination
 */
export const DEFAULT_PAGE_SIZE = 50;

/**
 * Maximum page size allowed by IT Glue API
 */
export const MAX_PAGE_SIZE = 1000;

/**
 * Options for paginated iteration
 */
export interface PaginationOptions {
  /** Starting page number (default: 1) */
  startPage?: number;
  /** Page size (default: 50, max: 1000) */
  pageSize?: number;
  /** Maximum number of items to return (undefined for all) */
  maxItems?: number;
}

/**
 * Create an async iterable that automatically paginates through all results
 * Yields individual items, not pages
 */
export function createPaginatedIterator<T>(
  fetcher: PageFetcher<T>,
  options: PaginationOptions = {}
): AsyncIterableWithHelpers<T> {
  const pageSize = Math.min(options.pageSize || DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE);
  const startPage = options.startPage || 1;
  const maxItems = options.maxItems;

  let currentPage = startPage;
  let currentItems: T[] = [];
  let currentIndex = 0;
  let totalReturned = 0;
  let hasMore = true;
  let meta: PaginationMeta | undefined;

  const iterator: AsyncIterator<T> = {
    async next(): Promise<IteratorResult<T>> {
      // Check if we've hit the max items limit
      if (maxItems !== undefined && totalReturned >= maxItems) {
        return { done: true, value: undefined };
      }

      // If we've exhausted current items, fetch the next page
      while (currentIndex >= currentItems.length && hasMore) {
        const response = await fetcher({
          number: currentPage,
          size: pageSize,
        });

        currentItems = response.data;
        meta = response.meta;
        currentIndex = 0;
        currentPage++;

        // Check if there are more pages
        hasMore = meta?.nextPage !== null && meta?.nextPage !== undefined;

        // If the response is empty, we're done
        if (currentItems.length === 0) {
          return { done: true, value: undefined };
        }
      }

      // If we've exhausted all items
      if (currentIndex >= currentItems.length) {
        return { done: true, value: undefined };
      }

      // Return the next item
      const item = currentItems[currentIndex++];
      totalReturned++;

      return { done: false, value: item };
    },
  };

  const iterable: AsyncIterableWithHelpers<T> = {
    [Symbol.asyncIterator](): AsyncIterator<T> {
      return iterator;
    },

    async toArray(): Promise<T[]> {
      const results: T[] = [];
      for await (const item of this) {
        results.push(item);
      }
      return results;
    },
  };

  return iterable;
}

/**
 * Create a page iterator that yields entire pages instead of individual items
 */
export function createPageIterator<T>(
  fetcher: PageFetcher<T>,
  options: PaginationOptions = {}
): AsyncIterableWithHelpers<PaginatedResponse<T>> {
  const pageSize = Math.min(options.pageSize || DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE);
  const startPage = options.startPage || 1;

  let currentPage = startPage;
  let hasMore = true;

  const iterator: AsyncIterator<PaginatedResponse<T>> = {
    async next(): Promise<IteratorResult<PaginatedResponse<T>>> {
      if (!hasMore) {
        return { done: true, value: undefined };
      }

      const response = await fetcher({
        number: currentPage,
        size: pageSize,
      });

      currentPage++;

      // Check if there are more pages
      hasMore =
        response.meta?.nextPage !== null && response.meta?.nextPage !== undefined;

      // If the response is empty and this is the first page, still return it
      // Otherwise, if empty, we're done
      if (response.data.length === 0 && currentPage > startPage + 1) {
        return { done: true, value: undefined };
      }

      return { done: false, value: response };
    },
  };

  const iterable: AsyncIterableWithHelpers<PaginatedResponse<T>> = {
    [Symbol.asyncIterator](): AsyncIterator<PaginatedResponse<T>> {
      return iterator;
    },

    async toArray(): Promise<PaginatedResponse<T>[]> {
      const results: PaginatedResponse<T>[] = [];
      for await (const page of this) {
        results.push(page);
      }
      return results;
    },
  };

  return iterable;
}

/**
 * Collect all items from a paginated iterator into an array
 * Convenience function for when you want all results at once
 */
export async function collectAll<T>(
  fetcher: PageFetcher<T>,
  options: PaginationOptions = {}
): Promise<T[]> {
  return createPaginatedIterator(fetcher, options).toArray();
}

/**
 * Get the first N items from a paginated source
 */
export async function take<T>(
  fetcher: PageFetcher<T>,
  count: number,
  options: PaginationOptions = {}
): Promise<T[]> {
  return createPaginatedIterator(fetcher, {
    ...options,
    maxItems: count,
  }).toArray();
}
