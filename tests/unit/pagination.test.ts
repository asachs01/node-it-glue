/**
 * Tests for pagination utilities
 */

import { describe, it, expect, vi } from 'vitest';
import {
  createPaginatedIterator,
  createPageIterator,
  collectAll,
  take,
  DEFAULT_PAGE_SIZE,
  MAX_PAGE_SIZE,
} from '../../src/pagination.js';
import type { PaginatedResponse } from '../../src/types/index.js';

describe('Pagination utilities', () => {
  describe('createPaginatedIterator', () => {
    it('should iterate through all pages', async () => {
      const fetcher = vi.fn()
        .mockResolvedValueOnce({
          data: [{ id: '1' }, { id: '2' }],
          meta: { currentPage: 1, nextPage: 2, prevPage: null, totalPages: 2, totalCount: 4 },
        })
        .mockResolvedValueOnce({
          data: [{ id: '3' }, { id: '4' }],
          meta: { currentPage: 2, nextPage: null, prevPage: 1, totalPages: 2, totalCount: 4 },
        });

      const iterator = createPaginatedIterator(fetcher);
      const results: { id: string }[] = [];

      for await (const item of iterator) {
        results.push(item as { id: string });
      }

      expect(results).toHaveLength(4);
      expect(results.map((r) => r.id)).toEqual(['1', '2', '3', '4']);
      expect(fetcher).toHaveBeenCalledTimes(2);
    });

    it('should support toArray()', async () => {
      const fetcher = vi.fn().mockResolvedValue({
        data: [{ id: '1' }, { id: '2' }],
        meta: { currentPage: 1, nextPage: null, prevPage: null, totalPages: 1, totalCount: 2 },
      });

      const iterator = createPaginatedIterator(fetcher);
      const results = await iterator.toArray();

      expect(results).toHaveLength(2);
    });

    it('should respect maxItems option', async () => {
      const fetcher = vi.fn().mockResolvedValue({
        data: [{ id: '1' }, { id: '2' }, { id: '3' }],
        meta: { currentPage: 1, nextPage: 2, prevPage: null, totalPages: 10, totalCount: 30 },
      });

      const iterator = createPaginatedIterator(fetcher, { maxItems: 2 });
      const results = await iterator.toArray();

      expect(results).toHaveLength(2);
    });

    it('should handle empty results', async () => {
      const fetcher = vi.fn().mockResolvedValue({
        data: [],
        meta: { currentPage: 1, nextPage: null, prevPage: null, totalPages: 0, totalCount: 0 },
      });

      const iterator = createPaginatedIterator(fetcher);
      const results = await iterator.toArray();

      expect(results).toHaveLength(0);
    });

    it('should pass correct page parameters', async () => {
      const fetcher = vi.fn().mockResolvedValue({
        data: [{ id: '1' }],
        meta: { currentPage: 1, nextPage: null, prevPage: null, totalPages: 1, totalCount: 1 },
      });

      const iterator = createPaginatedIterator(fetcher, { pageSize: 100, startPage: 5 });
      await iterator.toArray();

      expect(fetcher).toHaveBeenCalledWith({ number: 5, size: 100 });
    });

    it('should cap page size at MAX_PAGE_SIZE', async () => {
      const fetcher = vi.fn().mockResolvedValue({
        data: [{ id: '1' }],
        meta: { currentPage: 1, nextPage: null, prevPage: null, totalPages: 1, totalCount: 1 },
      });

      const iterator = createPaginatedIterator(fetcher, { pageSize: 5000 });
      await iterator.toArray();

      expect(fetcher).toHaveBeenCalledWith({ number: 1, size: MAX_PAGE_SIZE });
    });
  });

  describe('createPageIterator', () => {
    it('should iterate through pages', async () => {
      const fetcher = vi.fn()
        .mockResolvedValueOnce({
          data: [{ id: '1' }, { id: '2' }],
          meta: { currentPage: 1, nextPage: 2, prevPage: null, totalPages: 2, totalCount: 4 },
        })
        .mockResolvedValueOnce({
          data: [{ id: '3' }, { id: '4' }],
          meta: { currentPage: 2, nextPage: null, prevPage: 1, totalPages: 2, totalCount: 4 },
        });

      const iterator = createPageIterator(fetcher);
      const pages: PaginatedResponse<{ id: string }>[] = [];

      for await (const page of iterator) {
        pages.push(page as PaginatedResponse<{ id: string }>);
      }

      expect(pages).toHaveLength(2);
      expect(pages[0].data).toHaveLength(2);
      expect(pages[1].data).toHaveLength(2);
    });

    it('should support toArray()', async () => {
      const fetcher = vi.fn()
        .mockResolvedValueOnce({
          data: [{ id: '1' }],
          meta: { currentPage: 1, nextPage: 2, prevPage: null, totalPages: 2, totalCount: 2 },
        })
        .mockResolvedValueOnce({
          data: [{ id: '2' }],
          meta: { currentPage: 2, nextPage: null, prevPage: 1, totalPages: 2, totalCount: 2 },
        });

      const iterator = createPageIterator(fetcher);
      const pages = await iterator.toArray();

      expect(pages).toHaveLength(2);
    });
  });

  describe('collectAll', () => {
    it('should collect all items into an array', async () => {
      const fetcher = vi.fn()
        .mockResolvedValueOnce({
          data: [{ id: '1' }, { id: '2' }],
          meta: { currentPage: 1, nextPage: 2, prevPage: null, totalPages: 2, totalCount: 4 },
        })
        .mockResolvedValueOnce({
          data: [{ id: '3' }, { id: '4' }],
          meta: { currentPage: 2, nextPage: null, prevPage: 1, totalPages: 2, totalCount: 4 },
        });

      const results = await collectAll(fetcher);

      expect(results).toHaveLength(4);
    });
  });

  describe('take', () => {
    it('should take the first N items', async () => {
      const fetcher = vi.fn().mockResolvedValue({
        data: [{ id: '1' }, { id: '2' }, { id: '3' }, { id: '4' }, { id: '5' }],
        meta: { currentPage: 1, nextPage: 2, prevPage: null, totalPages: 10, totalCount: 50 },
      });

      const results = await take(fetcher, 3);

      expect(results).toHaveLength(3);
      expect(results.map((r) => (r as { id: string }).id)).toEqual(['1', '2', '3']);
    });

    it('should return all items if count exceeds total', async () => {
      const fetcher = vi.fn().mockResolvedValue({
        data: [{ id: '1' }, { id: '2' }],
        meta: { currentPage: 1, nextPage: null, prevPage: null, totalPages: 1, totalCount: 2 },
      });

      const results = await take(fetcher, 10);

      expect(results).toHaveLength(2);
    });
  });

  describe('constants', () => {
    it('should export DEFAULT_PAGE_SIZE', () => {
      expect(DEFAULT_PAGE_SIZE).toBe(50);
    });

    it('should export MAX_PAGE_SIZE', () => {
      expect(MAX_PAGE_SIZE).toBe(1000);
    });
  });
});
