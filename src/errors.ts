/**
 * Custom error classes for IT Glue API errors
 */

import type { JsonApiError } from './types/index.js';

/**
 * Base error class for all IT Glue errors
 */
export class ITGlueError extends Error {
  /** HTTP status code */
  public readonly statusCode: number;
  /** Raw response body */
  public readonly response: unknown;
  /** Request URL that caused the error */
  public readonly url?: string;
  /** HTTP method used */
  public readonly method?: string;

  constructor(
    message: string,
    statusCode: number,
    response?: unknown,
    url?: string,
    method?: string
  ) {
    super(message);
    this.name = 'ITGlueError';
    this.statusCode = statusCode;
    this.response = response;
    this.url = url;
    this.method = method;

    // Maintains proper stack trace in V8 environments
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  /**
   * Create a string representation of the error
   */
  toString(): string {
    const parts = [`${this.name}: ${this.message} (HTTP ${this.statusCode})`];
    if (this.url) {
      parts.push(`URL: ${this.method || 'GET'} ${this.url}`);
    }
    return parts.join('\n');
  }
}

/**
 * Error thrown when authentication fails (401, 403)
 */
export class ITGlueAuthenticationError extends ITGlueError {
  constructor(
    message: string = 'Authentication failed. Check your API key.',
    statusCode: number = 401,
    response?: unknown,
    url?: string,
    method?: string
  ) {
    super(message, statusCode, response, url, method);
    this.name = 'ITGlueAuthenticationError';
  }
}

/**
 * Error thrown when a resource is not found (404)
 */
export class ITGlueNotFoundError extends ITGlueError {
  constructor(
    message: string = 'Resource not found.',
    response?: unknown,
    url?: string,
    method?: string
  ) {
    super(message, 404, response, url, method);
    this.name = 'ITGlueNotFoundError';
  }
}

/**
 * Error thrown when request validation fails (422)
 */
export class ITGlueValidationError extends ITGlueError {
  /** Parsed validation errors from the JSON:API response */
  public readonly errors: JsonApiError[];

  constructor(
    message: string = 'Validation failed.',
    errors: JsonApiError[] = [],
    response?: unknown,
    url?: string,
    method?: string
  ) {
    super(message, 422, response, url, method);
    this.name = 'ITGlueValidationError';
    this.errors = errors;
  }

  /**
   * Get a formatted string of all validation errors
   */
  getErrorMessages(): string[] {
    return this.errors.map((error) => {
      const parts: string[] = [];
      if (error.title) parts.push(error.title);
      if (error.detail) parts.push(error.detail);
      if (error.source?.pointer) parts.push(`(${error.source.pointer})`);
      return parts.join(': ') || 'Unknown validation error';
    });
  }

  /**
   * Create a string representation including all validation errors
   */
  toString(): string {
    const base = super.toString();
    const errorMessages = this.getErrorMessages();
    if (errorMessages.length > 0) {
      return `${base}\nValidation errors:\n${errorMessages.map((e) => `  - ${e}`).join('\n')}`;
    }
    return base;
  }
}

/**
 * Error thrown when rate limit is exceeded (429)
 */
export class ITGlueRateLimitError extends ITGlueError {
  /** Suggested retry delay in milliseconds */
  public readonly retryAfter?: number;

  constructor(
    message: string = 'Rate limit exceeded.',
    retryAfter?: number,
    response?: unknown,
    url?: string,
    method?: string
  ) {
    super(message, 429, response, url, method);
    this.name = 'ITGlueRateLimitError';
    this.retryAfter = retryAfter;
  }
}

/**
 * Error thrown when the server returns a 5xx error
 */
export class ITGlueServerError extends ITGlueError {
  constructor(
    message: string = 'Server error occurred.',
    statusCode: number = 500,
    response?: unknown,
    url?: string,
    method?: string
  ) {
    super(message, statusCode, response, url, method);
    this.name = 'ITGlueServerError';
  }
}

/**
 * Error thrown for network-level errors (connection refused, timeout, etc.)
 */
export class ITGlueNetworkError extends ITGlueError {
  /** The original error that caused this network error */
  public readonly cause?: Error;

  constructor(
    message: string = 'Network error occurred.',
    cause?: Error,
    url?: string,
    method?: string
  ) {
    super(message, 0, undefined, url, method);
    this.name = 'ITGlueNetworkError';
    this.cause = cause;
  }
}

/**
 * Error thrown when request times out
 */
export class ITGlueTimeoutError extends ITGlueError {
  /** Timeout duration in milliseconds */
  public readonly timeout: number;

  constructor(
    message: string = 'Request timed out.',
    timeout: number,
    url?: string,
    method?: string
  ) {
    super(message, 0, undefined, url, method);
    this.name = 'ITGlueTimeoutError';
    this.timeout = timeout;
  }
}

/**
 * Create an appropriate error instance based on HTTP status code
 */
export function createErrorFromResponse(
  statusCode: number,
  response: unknown,
  url?: string,
  method?: string
): ITGlueError {
  const responseBody = response as { errors?: JsonApiError[]; message?: string } | undefined;
  const errors = responseBody?.errors;
  const message = errors?.[0]?.detail || errors?.[0]?.title || responseBody?.message;

  switch (statusCode) {
    case 401:
    case 403:
      return new ITGlueAuthenticationError(
        message || 'Authentication failed. Check your API key.',
        statusCode,
        response,
        url,
        method
      );

    case 404:
      return new ITGlueNotFoundError(
        message || 'Resource not found.',
        response,
        url,
        method
      );

    case 422:
      return new ITGlueValidationError(
        message || 'Validation failed.',
        errors || [],
        response,
        url,
        method
      );

    case 429:
      return new ITGlueRateLimitError(
        message || 'Rate limit exceeded.',
        undefined,
        response,
        url,
        method
      );

    default:
      if (statusCode >= 500) {
        return new ITGlueServerError(
          message || 'Server error occurred.',
          statusCode,
          response,
          url,
          method
        );
      }
      return new ITGlueError(
        message || `HTTP error ${statusCode}`,
        statusCode,
        response,
        url,
        method
      );
  }
}
