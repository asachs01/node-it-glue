/**
 * JSON:API serialization and deserialization utilities
 * Handles conversion between IT Glue's JSON:API format and clean TypeScript objects
 */

import type {
  JsonApiResource,
  JsonApiResponse,
  PaginationMeta,
  RelationshipLink,
} from './types/index.js';

/**
 * Convert a kebab-case string to camelCase
 */
export function kebabToCamel(str: string): string {
  return str.replace(/-([a-z])/g, (_, char) => char.toUpperCase());
}

/**
 * Convert a camelCase string to kebab-case
 */
export function camelToKebab(str: string): string {
  return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}

/**
 * Convert all keys in an object from kebab-case to camelCase
 */
export function convertKeysToCamel<T>(obj: unknown): T {
  if (obj === null || obj === undefined) {
    return obj as T;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => convertKeysToCamel(item)) as T;
  }

  if (typeof obj === 'object') {
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj)) {
      const camelKey = kebabToCamel(key);
      result[camelKey] = convertKeysToCamel(value);
    }
    return result as T;
  }

  return obj as T;
}

/**
 * Convert all keys in an object from camelCase to kebab-case
 */
export function convertKeysToKebab<T>(obj: unknown): T {
  if (obj === null || obj === undefined) {
    return obj as T;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => convertKeysToKebab(item)) as T;
  }

  if (typeof obj === 'object') {
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj)) {
      const kebabKey = camelToKebab(key);
      result[kebabKey] = convertKeysToKebab(value);
    }
    return result as T;
  }

  return obj as T;
}

/**
 * Extract relationship links from a JSON:API relationships object
 */
function deserializeRelationships(
  relationships: Record<string, { data: RelationshipLink | RelationshipLink[] | null }> | undefined
): Record<string, RelationshipLink[]> | undefined {
  if (!relationships) {
    return undefined;
  }

  const result: Record<string, RelationshipLink[]> = {};

  for (const [key, value] of Object.entries(relationships)) {
    const camelKey = kebabToCamel(key);
    if (value.data === null) {
      result[camelKey] = [];
    } else if (Array.isArray(value.data)) {
      result[camelKey] = value.data;
    } else {
      result[camelKey] = [value.data];
    }
  }

  return Object.keys(result).length > 0 ? result : undefined;
}

/**
 * Deserialize a single JSON:API resource into a flat object
 */
export function deserializeResource<T>(resource: JsonApiResource): T {
  // Start with id and type
  const result: Record<string, unknown> = {
    id: resource.id,
    type: resource.type,
  };

  // Flatten attributes into the top level, converting keys to camelCase
  if (resource.attributes) {
    for (const [key, value] of Object.entries(resource.attributes)) {
      const camelKey = kebabToCamel(key);
      result[camelKey] = convertKeysToCamel(value);
    }
  }

  // Process relationships
  const relationships = deserializeRelationships(resource.relationships);
  if (relationships) {
    result.relationships = relationships;
  }

  return result as T;
}

/**
 * Deserialize pagination meta information
 */
export function deserializeMeta(
  meta: JsonApiResponse['meta'] | undefined
): PaginationMeta | undefined {
  if (!meta) {
    return undefined;
  }

  return {
    currentPage: meta['current-page'] ?? 1,
    nextPage: meta['next-page'] ?? null,
    prevPage: meta['prev-page'] ?? null,
    totalPages: meta['total-pages'] ?? 1,
    totalCount: meta['total-count'] ?? 0,
  };
}

/**
 * Deserialize a JSON:API response into clean TypeScript objects
 * Handles both single resource and array responses
 */
export function deserialize<T>(response: JsonApiResponse): {
  data: T | T[];
  meta?: PaginationMeta;
  included?: T[];
} {
  const meta = deserializeMeta(response.meta);

  // Handle array response
  if (Array.isArray(response.data)) {
    const data = response.data.map((resource) => deserializeResource<T>(resource));
    const included = response.included?.map((resource) =>
      deserializeResource<T>(resource)
    );

    return { data, meta, included };
  }

  // Handle single resource response
  const data = deserializeResource<T>(response.data);
  const included = response.included?.map((resource) =>
    deserializeResource<T>(resource)
  );

  return { data, meta, included };
}

/**
 * Serialize attributes for a JSON:API request body
 */
function serializeAttributes(
  data: Record<string, unknown>
): Record<string, unknown> {
  const attributes: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(data)) {
    // Skip id and type - these are handled separately
    if (key === 'id' || key === 'type') {
      continue;
    }

    const kebabKey = camelToKebab(key);
    attributes[kebabKey] = convertKeysToKebab(value);
  }

  return attributes;
}

/**
 * Serialize data for a JSON:API POST/PATCH request
 */
export function serialize(
  type: string,
  data: Record<string, unknown>,
  id?: string
): { data: JsonApiResource } {
  const resource: JsonApiResource = {
    id: id || '',
    type,
    attributes: serializeAttributes(data),
  };

  // Only include id if provided (for updates)
  if (!id) {
    delete (resource as unknown as Record<string, unknown>).id;
  }

  return { data: resource };
}

/**
 * Build query parameters from filter/sort/page options
 */
export function buildQueryParams(params: Record<string, unknown>): URLSearchParams {
  const searchParams = new URLSearchParams();

  function addParam(prefix: string, value: unknown): void {
    if (value === undefined || value === null) {
      return;
    }

    if (typeof value === 'object' && !Array.isArray(value)) {
      // Handle nested objects (like filter, page)
      for (const [key, nestedValue] of Object.entries(value as Record<string, unknown>)) {
        const kebabKey = camelToKebab(key);
        const paramKey = prefix ? `${prefix}[${kebabKey}]` : kebabKey;
        addParam(paramKey, nestedValue);
      }
    } else if (Array.isArray(value)) {
      // Handle arrays (convert to comma-separated)
      searchParams.set(prefix, value.join(','));
    } else {
      // Handle primitive values
      searchParams.set(prefix, String(value));
    }
  }

  // Process all parameters
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null) {
      continue;
    }

    const kebabKey = camelToKebab(key);
    addParam(kebabKey, value);
  }

  return searchParams;
}

/**
 * Parse filter operators (gt, gte, lt, lte) into query param format
 */
export function buildFilterParams(
  filter: Record<string, unknown> | undefined
): Record<string, unknown> {
  if (!filter) {
    return {};
  }

  const result: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(filter)) {
    if (value === undefined || value === null) {
      continue;
    }

    // Handle operator objects (gt, gte, lt, lte)
    if (
      typeof value === 'object' &&
      !Array.isArray(value) &&
      ('gt' in value || 'gte' in value || 'lt' in value || 'lte' in value)
    ) {
      const operators = value as Record<string, unknown>;
      if (operators.gt !== undefined) {
        result[`${key}[gt]`] = operators.gt;
      }
      if (operators.gte !== undefined) {
        result[`${key}[gte]`] = operators.gte;
      }
      if (operators.lt !== undefined) {
        result[`${key}[lt]`] = operators.lt;
      }
      if (operators.lte !== undefined) {
        result[`${key}[lte]`] = operators.lte;
      }
    } else {
      result[key] = value;
    }
  }

  return result;
}
