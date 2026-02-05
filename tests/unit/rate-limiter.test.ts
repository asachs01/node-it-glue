/**
 * Tests for rate limiter
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { RateLimiter, retryWithBackoff } from '../../src/rate-limiter.js';
import { DEFAULT_RATE_LIMIT_CONFIG } from '../../src/types/index.js';

describe('RateLimiter', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should track requests', () => {
    const limiter = new RateLimiter(DEFAULT_RATE_LIMIT_CONFIG);

    expect(limiter.currentCount).toBe(0);

    limiter.recordRequest();
    expect(limiter.currentCount).toBe(1);

    limiter.recordRequest();
    expect(limiter.currentCount).toBe(2);
  });

  it('should calculate remaining requests', () => {
    const config = { ...DEFAULT_RATE_LIMIT_CONFIG, maxRequests: 100 };
    const limiter = new RateLimiter(config);

    expect(limiter.remaining).toBe(100);

    for (let i = 0; i < 30; i++) {
      limiter.recordRequest();
    }

    expect(limiter.remaining).toBe(70);
  });

  it('should indicate when throttling should start', () => {
    const config = {
      ...DEFAULT_RATE_LIMIT_CONFIG,
      maxRequests: 100,
      throttleThreshold: 0.8,
    };
    const limiter = new RateLimiter(config);

    // 79 requests - not throttling
    for (let i = 0; i < 79; i++) {
      limiter.recordRequest();
    }
    expect(limiter.isThrottling).toBe(false);

    // 80th request - should start throttling
    limiter.recordRequest();
    expect(limiter.isThrottling).toBe(true);
  });

  it('should indicate when rate limited', () => {
    const config = { ...DEFAULT_RATE_LIMIT_CONFIG, maxRequests: 10 };
    const limiter = new RateLimiter(config);

    for (let i = 0; i < 9; i++) {
      limiter.recordRequest();
    }
    expect(limiter.isLimited).toBe(false);

    limiter.recordRequest();
    expect(limiter.isLimited).toBe(true);
  });

  it('should prune old requests after window expires', () => {
    const config = {
      ...DEFAULT_RATE_LIMIT_CONFIG,
      maxRequests: 100,
      windowMs: 60000, // 1 minute
    };
    const limiter = new RateLimiter(config);

    // Record some requests
    for (let i = 0; i < 10; i++) {
      limiter.recordRequest();
    }
    expect(limiter.currentCount).toBe(10);

    // Advance time past the window
    vi.advanceTimersByTime(61000);

    // Old requests should be pruned
    expect(limiter.currentCount).toBe(0);
  });

  it('should not track requests when disabled', () => {
    const config = { ...DEFAULT_RATE_LIMIT_CONFIG, enabled: false };
    const limiter = new RateLimiter(config);

    limiter.recordRequest();
    limiter.recordRequest();

    expect(limiter.currentCount).toBe(0);
    expect(limiter.isThrottling).toBe(false);
    expect(limiter.isLimited).toBe(false);
  });

  it('should calculate delay when throttling', () => {
    const config = {
      ...DEFAULT_RATE_LIMIT_CONFIG,
      maxRequests: 100,
      throttleThreshold: 0.8,
      retryAfterMs: 1000,
    };
    const limiter = new RateLimiter(config);

    // Below threshold - no delay
    for (let i = 0; i < 79; i++) {
      limiter.recordRequest();
    }
    expect(limiter.getDelayMs()).toBe(0);

    // At threshold (80) - isThrottling is true but delay is 0 at exactly threshold
    limiter.recordRequest();
    expect(limiter.isThrottling).toBe(true);

    // Above threshold - delay starts (at 85%, delay should be > 0)
    for (let i = 0; i < 5; i++) {
      limiter.recordRequest();
    }
    expect(limiter.getDelayMs()).toBeGreaterThan(0);
  });

  it('should calculate delay when limited', () => {
    const config = {
      ...DEFAULT_RATE_LIMIT_CONFIG,
      maxRequests: 10,
      windowMs: 60000,
    };
    const limiter = new RateLimiter(config);

    // Fill the bucket
    for (let i = 0; i < 10; i++) {
      limiter.recordRequest();
    }

    // Should need to wait for oldest request to expire
    const delay = limiter.getDelayMs();
    expect(delay).toBeGreaterThan(0);
    expect(delay).toBeLessThanOrEqual(60000);
  });

  it('should reset the limiter', () => {
    const limiter = new RateLimiter(DEFAULT_RATE_LIMIT_CONFIG);

    for (let i = 0; i < 50; i++) {
      limiter.recordRequest();
    }
    expect(limiter.currentCount).toBe(50);

    limiter.reset();
    expect(limiter.currentCount).toBe(0);
  });

  it('should provide status information', () => {
    const config = {
      ...DEFAULT_RATE_LIMIT_CONFIG,
      maxRequests: 100,
      windowMs: 60000,
    };
    const limiter = new RateLimiter(config);

    for (let i = 0; i < 25; i++) {
      limiter.recordRequest();
    }

    const status = limiter.getStatus();

    expect(status.enabled).toBe(true);
    expect(status.currentCount).toBe(25);
    expect(status.maxRequests).toBe(100);
    expect(status.remaining).toBe(75);
    expect(status.windowMs).toBe(60000);
    expect(status.isThrottling).toBe(false);
    expect(status.isLimited).toBe(false);
  });
});

describe('retryWithBackoff', () => {
  // Use real timers with short delays for these tests
  it('should return immediately on success', async () => {
    const fn = vi.fn().mockResolvedValue('success');

    const result = await retryWithBackoff(fn, {
      maxRetries: 3,
      baseDelayMs: 1,
    });

    expect(result).toBe('success');
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('should retry on failure', async () => {
    const fn = vi.fn()
      .mockRejectedValueOnce(new Error('fail 1'))
      .mockRejectedValueOnce(new Error('fail 2'))
      .mockResolvedValue('success');

    const result = await retryWithBackoff(fn, {
      maxRetries: 3,
      baseDelayMs: 1,
      maxDelayMs: 5,
    });

    expect(result).toBe('success');
    expect(fn).toHaveBeenCalledTimes(3);
  }, 1000);

  it('should throw after max retries', async () => {
    const fn = vi.fn().mockRejectedValue(new Error('always fails'));

    await expect(
      retryWithBackoff(fn, {
        maxRetries: 2,
        baseDelayMs: 1,
        maxDelayMs: 5,
      })
    ).rejects.toThrow('always fails');

    expect(fn).toHaveBeenCalledTimes(3); // Initial + 2 retries
  }, 1000);

  it('should increase delay with each retry', async () => {
    const callTimes: number[] = [];

    const fn = vi.fn().mockImplementation(() => {
      callTimes.push(Date.now());

      if (fn.mock.calls.length < 3) {
        return Promise.reject(new Error('fail'));
      }
      return Promise.resolve('success');
    });

    await retryWithBackoff(fn, {
      maxRetries: 3,
      baseDelayMs: 10,
      maxDelayMs: 100,
    });

    expect(fn).toHaveBeenCalledTimes(3);
    expect(callTimes.length).toBe(3);

    // Calculate delays between calls
    const delay1 = callTimes[1] - callTimes[0];
    const delay2 = callTimes[2] - callTimes[1];

    // Second delay should be >= first delay (exponential backoff)
    // Allow for jitter variation
    expect(delay2).toBeGreaterThanOrEqual(delay1 * 0.7);
  }, 5000);

  it('should respect max delay', async () => {
    const fn = vi.fn()
      .mockRejectedValueOnce(new Error('fail'))
      .mockRejectedValueOnce(new Error('fail'))
      .mockRejectedValueOnce(new Error('fail'))
      .mockRejectedValueOnce(new Error('fail'))
      .mockResolvedValue('success');

    const startTime = Date.now();

    await retryWithBackoff(fn, {
      maxRetries: 5,
      baseDelayMs: 5,
      maxDelayMs: 20,
    });

    const totalTime = Date.now() - startTime;

    expect(fn).toHaveBeenCalledTimes(5);
    // Total time should be bounded by max delays
    // With maxDelayMs=20 and some jitter, should complete within reasonable time
    expect(totalTime).toBeLessThan(500);
  }, 5000);
});
