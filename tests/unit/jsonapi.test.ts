/**
 * Tests for JSON:API serialization/deserialization
 */

import { describe, it, expect } from 'vitest';
import {
  kebabToCamel,
  camelToKebab,
  convertKeysToCamel,
  convertKeysToKebab,
  deserialize,
  serialize,
  buildQueryParams,
  buildFilterParams,
} from '../../src/jsonapi.js';

describe('JSON:API utilities', () => {
  describe('kebabToCamel', () => {
    it('should convert kebab-case to camelCase', () => {
      expect(kebabToCamel('organization-type-name')).toBe('organizationTypeName');
      expect(kebabToCamel('created-at')).toBe('createdAt');
      expect(kebabToCamel('name')).toBe('name');
      expect(kebabToCamel('some-url-value')).toBe('someUrlValue');
    });

    it('should handle empty string', () => {
      expect(kebabToCamel('')).toBe('');
    });
  });

  describe('camelToKebab', () => {
    it('should convert camelCase to kebab-case', () => {
      expect(camelToKebab('organizationTypeName')).toBe('organization-type-name');
      expect(camelToKebab('createdAt')).toBe('created-at');
      expect(camelToKebab('name')).toBe('name');
      expect(camelToKebab('someURLValue')).toBe('some-urlvalue');
    });

    it('should handle empty string', () => {
      expect(camelToKebab('')).toBe('');
    });
  });

  describe('convertKeysToCamel', () => {
    it('should convert all keys in an object', () => {
      const input = {
        'organization-type-name': 'Customer',
        'created-at': '2024-01-01',
        nested: {
          'some-value': 123,
        },
      };

      const result = convertKeysToCamel(input);

      expect(result).toEqual({
        organizationTypeName: 'Customer',
        createdAt: '2024-01-01',
        nested: {
          someValue: 123,
        },
      });
    });

    it('should handle arrays', () => {
      const input = [
        { 'first-name': 'John' },
        { 'first-name': 'Jane' },
      ];

      const result = convertKeysToCamel(input);

      expect(result).toEqual([
        { firstName: 'John' },
        { firstName: 'Jane' },
      ]);
    });

    it('should handle null and undefined', () => {
      expect(convertKeysToCamel(null)).toBeNull();
      expect(convertKeysToCamel(undefined)).toBeUndefined();
    });

    it('should handle primitive values', () => {
      expect(convertKeysToCamel('string')).toBe('string');
      expect(convertKeysToCamel(123)).toBe(123);
      expect(convertKeysToCamel(true)).toBe(true);
    });
  });

  describe('convertKeysToKebab', () => {
    it('should convert all keys in an object', () => {
      const input = {
        organizationTypeName: 'Customer',
        createdAt: '2024-01-01',
        nested: {
          someValue: 123,
        },
      };

      const result = convertKeysToKebab(input);

      expect(result).toEqual({
        'organization-type-name': 'Customer',
        'created-at': '2024-01-01',
        nested: {
          'some-value': 123,
        },
      });
    });
  });

  describe('deserialize', () => {
    it('should deserialize a single resource', () => {
      const response = {
        data: {
          id: '123',
          type: 'organizations',
          attributes: {
            name: 'Acme Corp',
            'organization-type-name': 'Customer',
            'created-at': '2024-01-01T00:00:00.000Z',
          },
          relationships: {
            locations: {
              data: [{ id: '456', type: 'locations' }],
            },
          },
        },
      };

      const result = deserialize(response);

      expect(result.data).toEqual({
        id: '123',
        type: 'organizations',
        name: 'Acme Corp',
        organizationTypeName: 'Customer',
        createdAt: '2024-01-01T00:00:00.000Z',
        relationships: {
          locations: [{ id: '456', type: 'locations' }],
        },
      });
    });

    it('should deserialize an array of resources', () => {
      const response = {
        data: [
          {
            id: '1',
            type: 'organizations',
            attributes: {
              name: 'Org 1',
            },
          },
          {
            id: '2',
            type: 'organizations',
            attributes: {
              name: 'Org 2',
            },
          },
        ],
        meta: {
          'current-page': 1,
          'next-page': 2,
          'prev-page': null,
          'total-pages': 5,
          'total-count': 100,
        },
      };

      const result = deserialize(response);

      expect(Array.isArray(result.data)).toBe(true);
      expect(result.data).toHaveLength(2);
      expect(result.meta).toEqual({
        currentPage: 1,
        nextPage: 2,
        prevPage: null,
        totalPages: 5,
        totalCount: 100,
      });
    });

    it('should handle null relationships', () => {
      const response = {
        data: {
          id: '123',
          type: 'organizations',
          attributes: {
            name: 'Acme',
          },
          relationships: {
            locations: {
              data: null,
            },
          },
        },
      };

      const result = deserialize(response);

      expect((result.data as Record<string, unknown>).relationships).toEqual({
        locations: [],
      });
    });

    it('should handle included resources', () => {
      const response = {
        data: {
          id: '123',
          type: 'organizations',
          attributes: {
            name: 'Acme',
          },
        },
        included: [
          {
            id: '456',
            type: 'locations',
            attributes: {
              name: 'Main Office',
            },
          },
        ],
      };

      const result = deserialize(response);

      expect(result.included).toHaveLength(1);
      expect(result.included?.[0]).toEqual({
        id: '456',
        type: 'locations',
        name: 'Main Office',
      });
    });
  });

  describe('serialize', () => {
    it('should serialize data for create request', () => {
      const data = {
        name: 'New Organization',
        organizationTypeId: 42,
        quickNotes: 'Some notes',
      };

      const result = serialize('organizations', data);

      expect(result).toEqual({
        data: {
          type: 'organizations',
          attributes: {
            name: 'New Organization',
            'organization-type-id': 42,
            'quick-notes': 'Some notes',
          },
        },
      });
    });

    it('should serialize data for update request', () => {
      const data = {
        name: 'Updated Name',
      };

      const result = serialize('organizations', data, '123');

      expect(result).toEqual({
        data: {
          id: '123',
          type: 'organizations',
          attributes: {
            name: 'Updated Name',
          },
        },
      });
    });

    it('should handle nested objects', () => {
      const data = {
        name: 'Test',
        contactEmails: [
          { value: 'test@example.com', primary: true },
        ],
      };

      const result = serialize('contacts', data);

      expect(result.data.attributes).toEqual({
        name: 'Test',
        'contact-emails': [
          { value: 'test@example.com', primary: true },
        ],
      });
    });
  });

  describe('buildQueryParams', () => {
    it('should build basic query params', () => {
      const params = {
        sort: 'name',
        include: 'locations',
      };

      const result = buildQueryParams(params);

      expect(result.get('sort')).toBe('name');
      expect(result.get('include')).toBe('locations');
    });

    it('should handle nested objects (filter)', () => {
      const params = {
        filter: {
          name: 'Acme',
          organizationTypeId: 42,
        },
      };

      const result = buildQueryParams(params);

      expect(result.get('filter[name]')).toBe('Acme');
      expect(result.get('filter[organization-type-id]')).toBe('42');
    });

    it('should handle page parameters', () => {
      const params = {
        page: {
          size: 50,
          number: 2,
        },
      };

      const result = buildQueryParams(params);

      expect(result.get('page[size]')).toBe('50');
      expect(result.get('page[number]')).toBe('2');
    });

    it('should handle arrays', () => {
      const params = {
        filter: {
          excludeId: [1, 2, 3],
        },
      };

      const result = buildQueryParams(params);

      expect(result.get('filter[exclude-id]')).toBe('1,2,3');
    });

    it('should skip null and undefined values', () => {
      const params = {
        sort: 'name',
        include: null,
        page: undefined,
      };

      const result = buildQueryParams(params);

      expect(result.get('sort')).toBe('name');
      expect(result.has('include')).toBe(false);
      expect(result.has('page')).toBe(false);
    });
  });

  describe('buildFilterParams', () => {
    it('should handle basic filters', () => {
      const filter = {
        name: 'Acme',
        organizationTypeId: 42,
      };

      const result = buildFilterParams(filter);

      expect(result).toEqual({
        name: 'Acme',
        organizationTypeId: 42,
      });
    });

    it('should handle operator objects', () => {
      const filter = {
        createdAt: { gt: '2024-01-01', lt: '2024-12-31' },
        updatedAt: { gte: '2024-06-01' },
      };

      const result = buildFilterParams(filter);

      expect(result).toEqual({
        'createdAt[gt]': '2024-01-01',
        'createdAt[lt]': '2024-12-31',
        'updatedAt[gte]': '2024-06-01',
      });
    });

    it('should handle undefined filter', () => {
      const result = buildFilterParams(undefined);
      expect(result).toEqual({});
    });

    it('should skip undefined values', () => {
      const filter = {
        name: 'Acme',
        type: undefined,
      };

      const result = buildFilterParams(filter);

      expect(result).toEqual({
        name: 'Acme',
      });
    });
  });
});
