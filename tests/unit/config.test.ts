/**
 * Tests for configuration utilities
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  validateApiKey,
  resolveBaseUrl,
  resolveRateLimitConfig,
  resolveConfig,
  getHeaders,
} from '../../src/config.js';
import { REGION_URLS, DEFAULT_RATE_LIMIT_CONFIG } from '../../src/types/index.js';

describe('Configuration utilities', () => {
  describe('validateApiKey', () => {
    let consoleWarnSpy: ReturnType<typeof vi.spyOn>;

    beforeEach(() => {
      consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    });

    afterEach(() => {
      consoleWarnSpy.mockRestore();
    });

    it('should throw for missing API key', () => {
      expect(() => validateApiKey(undefined)).toThrow('IT Glue API key is required');
    });

    it('should throw for empty API key', () => {
      expect(() => validateApiKey('')).toThrow('IT Glue API key is required');
    });

    it('should accept valid API key format', () => {
      expect(() => validateApiKey('ITG.abc123def456')).not.toThrow();
    });

    it('should warn for non-standard key format', () => {
      validateApiKey('not-standard-format');
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining('does not start with "ITG."')
      );
    });
  });

  describe('resolveBaseUrl', () => {
    it('should use explicit baseUrl if provided', () => {
      const url = resolveBaseUrl({
        apiKey: 'ITG.test',
        baseUrl: 'https://custom.itglue.com',
      });

      expect(url).toBe('https://custom.itglue.com');
    });

    it('should strip trailing slash from baseUrl', () => {
      const url = resolveBaseUrl({
        apiKey: 'ITG.test',
        baseUrl: 'https://custom.itglue.com/',
      });

      expect(url).toBe('https://custom.itglue.com');
    });

    it('should resolve US region', () => {
      const url = resolveBaseUrl({ apiKey: 'ITG.test', region: 'us' });
      expect(url).toBe(REGION_URLS.us);
    });

    it('should resolve EU region', () => {
      const url = resolveBaseUrl({ apiKey: 'ITG.test', region: 'eu' });
      expect(url).toBe(REGION_URLS.eu);
    });

    it('should resolve AU region', () => {
      const url = resolveBaseUrl({ apiKey: 'ITG.test', region: 'au' });
      expect(url).toBe(REGION_URLS.au);
    });

    it('should default to US region', () => {
      const url = resolveBaseUrl({ apiKey: 'ITG.test' });
      expect(url).toBe(REGION_URLS.us);
    });

    it('should throw for invalid region', () => {
      expect(() =>
        resolveBaseUrl({ apiKey: 'ITG.test', region: 'invalid' as 'us' })
      ).toThrow('Invalid region "invalid"');
    });
  });

  describe('resolveRateLimitConfig', () => {
    it('should return defaults when no config provided', () => {
      const config = resolveRateLimitConfig();
      expect(config).toEqual(DEFAULT_RATE_LIMIT_CONFIG);
    });

    it('should merge partial config with defaults', () => {
      const config = resolveRateLimitConfig({
        maxRequests: 1000,
        enabled: false,
      });

      expect(config.maxRequests).toBe(1000);
      expect(config.enabled).toBe(false);
      expect(config.windowMs).toBe(DEFAULT_RATE_LIMIT_CONFIG.windowMs);
      expect(config.throttleThreshold).toBe(DEFAULT_RATE_LIMIT_CONFIG.throttleThreshold);
    });
  });

  describe('resolveConfig', () => {
    let consoleWarnSpy: ReturnType<typeof vi.spyOn>;

    beforeEach(() => {
      consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    });

    afterEach(() => {
      consoleWarnSpy.mockRestore();
    });

    it('should resolve full config', () => {
      const config = resolveConfig({
        apiKey: 'ITG.test123',
        region: 'eu',
        timeout: 60000,
        rateLimiter: { maxRequests: 1000 },
        includeRelationships: true,
      });

      expect(config.apiKey).toBe('ITG.test123');
      expect(config.baseUrl).toBe(REGION_URLS.eu);
      expect(config.timeout).toBe(60000);
      expect(config.rateLimiter.maxRequests).toBe(1000);
      expect(config.includeRelationships).toBe(true);
    });

    it('should use defaults for missing values', () => {
      const config = resolveConfig({
        apiKey: 'ITG.test123',
      });

      expect(config.baseUrl).toBe(REGION_URLS.us);
      expect(config.timeout).toBe(30000);
      expect(config.rateLimiter).toEqual(DEFAULT_RATE_LIMIT_CONFIG);
      expect(config.includeRelationships).toBe(false);
    });

    it('should throw for missing API key', () => {
      expect(() => resolveConfig({ apiKey: '' })).toThrow();
    });
  });

  describe('getHeaders', () => {
    it('should return correct headers', () => {
      const headers = getHeaders('ITG.test123');

      expect(headers).toEqual({
        'x-api-key': 'ITG.test123',
        'Content-Type': 'application/vnd.api+json',
        'Accept': 'application/vnd.api+json',
      });
    });
  });
});
