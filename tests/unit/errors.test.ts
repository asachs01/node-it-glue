/**
 * Tests for error classes
 */

import { describe, it, expect } from 'vitest';
import {
  ITGlueError,
  ITGlueAuthenticationError,
  ITGlueNotFoundError,
  ITGlueValidationError,
  ITGlueRateLimitError,
  ITGlueServerError,
  ITGlueNetworkError,
  ITGlueTimeoutError,
  createErrorFromResponse,
} from '../../src/errors.js';

describe('Error classes', () => {
  describe('ITGlueError', () => {
    it('should create a basic error', () => {
      const error = new ITGlueError('Something went wrong', 400);

      expect(error.message).toBe('Something went wrong');
      expect(error.statusCode).toBe(400);
      expect(error.name).toBe('ITGlueError');
    });

    it('should include response and URL info', () => {
      const error = new ITGlueError(
        'Error',
        400,
        { data: 'test' },
        'https://api.itglue.com/organizations',
        'GET'
      );

      expect(error.response).toEqual({ data: 'test' });
      expect(error.url).toBe('https://api.itglue.com/organizations');
      expect(error.method).toBe('GET');
    });

    it('should have a meaningful toString', () => {
      const error = new ITGlueError(
        'Bad request',
        400,
        null,
        'https://api.itglue.com/organizations',
        'POST'
      );

      const str = error.toString();

      expect(str).toContain('ITGlueError');
      expect(str).toContain('Bad request');
      expect(str).toContain('400');
      expect(str).toContain('POST https://api.itglue.com/organizations');
    });
  });

  describe('ITGlueAuthenticationError', () => {
    it('should create with default message', () => {
      const error = new ITGlueAuthenticationError();

      expect(error.message).toBe('Authentication failed. Check your API key.');
      expect(error.statusCode).toBe(401);
      expect(error.name).toBe('ITGlueAuthenticationError');
    });

    it('should accept custom message and status', () => {
      const error = new ITGlueAuthenticationError('Access denied', 403);

      expect(error.message).toBe('Access denied');
      expect(error.statusCode).toBe(403);
    });
  });

  describe('ITGlueNotFoundError', () => {
    it('should create with default message', () => {
      const error = new ITGlueNotFoundError();

      expect(error.message).toBe('Resource not found.');
      expect(error.statusCode).toBe(404);
      expect(error.name).toBe('ITGlueNotFoundError');
    });
  });

  describe('ITGlueValidationError', () => {
    it('should create with errors array', () => {
      const errors = [
        { title: 'Validation Error', detail: 'Name is required', source: { pointer: '/data/attributes/name' } },
        { title: 'Validation Error', detail: 'Type is invalid' },
      ];

      const error = new ITGlueValidationError('Validation failed', errors);

      expect(error.message).toBe('Validation failed');
      expect(error.statusCode).toBe(422);
      expect(error.name).toBe('ITGlueValidationError');
      expect(error.errors).toEqual(errors);
    });

    it('should format error messages', () => {
      const errors = [
        { title: 'Validation Error', detail: 'Name is required', source: { pointer: '/data/attributes/name' } },
      ];

      const error = new ITGlueValidationError('Validation failed', errors);
      const messages = error.getErrorMessages();

      expect(messages).toHaveLength(1);
      expect(messages[0]).toContain('Name is required');
      expect(messages[0]).toContain('/data/attributes/name');
    });

    it('should have meaningful toString with errors', () => {
      const errors = [
        { title: 'Error', detail: 'Field is required' },
      ];

      const error = new ITGlueValidationError('Validation failed', errors);
      const str = error.toString();

      expect(str).toContain('Validation errors');
      expect(str).toContain('Field is required');
    });
  });

  describe('ITGlueRateLimitError', () => {
    it('should create with retry after', () => {
      const error = new ITGlueRateLimitError('Rate limit exceeded', 5000);

      expect(error.message).toBe('Rate limit exceeded');
      expect(error.statusCode).toBe(429);
      expect(error.retryAfter).toBe(5000);
      expect(error.name).toBe('ITGlueRateLimitError');
    });
  });

  describe('ITGlueServerError', () => {
    it('should create with status code', () => {
      const error = new ITGlueServerError('Internal error', 503);

      expect(error.message).toBe('Internal error');
      expect(error.statusCode).toBe(503);
      expect(error.name).toBe('ITGlueServerError');
    });

    it('should default to 500', () => {
      const error = new ITGlueServerError();

      expect(error.statusCode).toBe(500);
    });
  });

  describe('ITGlueNetworkError', () => {
    it('should create with cause', () => {
      const cause = new TypeError('Network request failed');
      const error = new ITGlueNetworkError('Network error', cause);

      expect(error.message).toBe('Network error');
      expect(error.statusCode).toBe(0);
      expect(error.cause).toBe(cause);
      expect(error.name).toBe('ITGlueNetworkError');
    });
  });

  describe('ITGlueTimeoutError', () => {
    it('should create with timeout value', () => {
      const error = new ITGlueTimeoutError('Timed out', 30000);

      expect(error.message).toBe('Timed out');
      expect(error.statusCode).toBe(0);
      expect(error.timeout).toBe(30000);
      expect(error.name).toBe('ITGlueTimeoutError');
    });
  });

  describe('createErrorFromResponse', () => {
    it('should create ITGlueAuthenticationError for 401', () => {
      const error = createErrorFromResponse(401, { errors: [{ detail: 'Invalid key' }] });

      expect(error).toBeInstanceOf(ITGlueAuthenticationError);
      expect(error.message).toBe('Invalid key');
    });

    it('should create ITGlueAuthenticationError for 403', () => {
      const error = createErrorFromResponse(403, { errors: [{ detail: 'Forbidden' }] });

      expect(error).toBeInstanceOf(ITGlueAuthenticationError);
      expect(error.message).toBe('Forbidden');
    });

    it('should create ITGlueNotFoundError for 404', () => {
      const error = createErrorFromResponse(404, { errors: [{ detail: 'Not found' }] });

      expect(error).toBeInstanceOf(ITGlueNotFoundError);
      expect(error.message).toBe('Not found');
    });

    it('should create ITGlueValidationError for 422', () => {
      const errors = [{ title: 'Error', detail: 'Invalid' }];
      const error = createErrorFromResponse(422, { errors });

      expect(error).toBeInstanceOf(ITGlueValidationError);
      expect((error as ITGlueValidationError).errors).toEqual(errors);
    });

    it('should create ITGlueRateLimitError for 429', () => {
      const error = createErrorFromResponse(429, {});

      expect(error).toBeInstanceOf(ITGlueRateLimitError);
    });

    it('should create ITGlueServerError for 5xx', () => {
      const error500 = createErrorFromResponse(500, {});
      const error502 = createErrorFromResponse(502, {});
      const error503 = createErrorFromResponse(503, {});

      expect(error500).toBeInstanceOf(ITGlueServerError);
      expect(error502).toBeInstanceOf(ITGlueServerError);
      expect(error503).toBeInstanceOf(ITGlueServerError);
    });

    it('should create generic ITGlueError for other status codes', () => {
      const error = createErrorFromResponse(418, {});

      expect(error).toBeInstanceOf(ITGlueError);
      expect(error.statusCode).toBe(418);
    });

    it('should use default messages when response has no errors', () => {
      const error401 = createErrorFromResponse(401, {});
      const error404 = createErrorFromResponse(404, {});
      const error422 = createErrorFromResponse(422, {});
      const error429 = createErrorFromResponse(429, {});
      const error500 = createErrorFromResponse(500, {});

      expect(error401.message).toBe('Authentication failed. Check your API key.');
      expect(error404.message).toBe('Resource not found.');
      expect(error422.message).toBe('Validation failed.');
      expect(error429.message).toBe('Rate limit exceeded.');
      expect(error500.message).toBe('Server error occurred.');
    });

    it('should include URL and method info', () => {
      const error = createErrorFromResponse(
        404,
        {},
        'https://api.itglue.com/organizations/123',
        'GET'
      );

      expect(error.url).toBe('https://api.itglue.com/organizations/123');
      expect(error.method).toBe('GET');
    });
  });
});
