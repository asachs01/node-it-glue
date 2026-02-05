# node-it-glue

Comprehensive, fully-typed Node.js/TypeScript library for the IT Glue API.

## Features

- **Complete API coverage** - Every documented IT Glue endpoint is implemented
- **Strong TypeScript types** - Full type definitions for all request/response payloads
- **JSON:API abstraction** - Unwrap the JSON:API envelope so consumers work with clean objects
- **Automatic pagination** - Iterator/generator patterns for seamless multi-page retrieval
- **Rate limit handling** - Built-in request throttling (3000 req / 5 min) with backoff
- **Zero live API testing** - Full test suite with mocked HTTP responses

## Installation

```bash
npm install node-it-glue
```

## Quick Start

```typescript
import { ITGlueClient } from 'node-it-glue';

const client = new ITGlueClient({
  apiKey: 'ITG.xxxxxxxxxxxxxxxxxxxxxxxx',
  region: 'us', // 'us' | 'eu' | 'au'
});

// List organizations
const { data, meta } = await client.organizations.list({
  filter: { organizationStatusId: 1 },
  page: { size: 50 },
});

console.log(`Found ${meta.totalCount} organizations`);
for (const org of data) {
  console.log(org.name);
}

// Auto-paginate all configurations for an org
for await (const config of client.configurations.listAll({
  filter: { organizationId: 12345 },
})) {
  console.log(config.name, config.serialNumber);
}
```

## Configuration

```typescript
const client = new ITGlueClient({
  apiKey: 'ITG.xxxxxxxxxxxxxxxxxxxxxxxx', // Required
  region: 'us',                           // 'us' | 'eu' | 'au' (default: 'us')
  // OR explicit base URL:
  // baseUrl: 'https://api.itglue.com',
  timeout: 30000,                         // Request timeout in ms (default: 30000)
  rateLimiter: {                          // Rate limiting options
    enabled: true,                        // Enable rate limiting (default: true)
    maxRequests: 3000,                    // Max requests per window (default: 3000)
    windowMs: 300000,                     // Window duration in ms (default: 5 minutes)
    throttleThreshold: 0.8,               // Start throttling at 80% (default: 0.8)
    retryAfterMs: 5000,                   // Retry delay (default: 5000)
    maxRetries: 3                         // Max retry attempts (default: 3)
  }
});
```

### Regional Base URLs

| Region | Base URL |
|--------|----------|
| `us`   | `https://api.itglue.com` |
| `eu`   | `https://api.eu.itglue.com` |
| `au`   | `https://api.au.itglue.com` |

## Pagination

All list methods return paginated results. You can manually paginate:

```typescript
const page1 = await client.organizations.list({ page: { size: 50, number: 1 } });
const page2 = await client.organizations.list({ page: { size: 50, number: 2 } });
```

Or use automatic pagination with async iterators:

```typescript
// Iterate through all items
for await (const org of client.organizations.listAll()) {
  console.log(org.name);
}

// Collect all into an array
const allOrgs = await client.organizations.listAll().toArray();
```

## Filtering

IT Glue supports extensive filtering options:

```typescript
const orgs = await client.organizations.list({
  filter: {
    name: 'Acme',
    organizationTypeId: 42,
    organizationStatusId: 1,
    excludeId: [100, 200],
    createdAt: { gt: '2024-01-01' },
    updatedAt: { lt: '2025-01-01' },
  },
  sort: 'name',          // or '-name' for descending
  page: { size: 100, number: 1 },
  include: 'locations',  // sideload related resources
});
```

## Error Handling

The library provides typed error classes for different error scenarios:

```typescript
import {
  ITGlueClient,
  ITGlueNotFoundError,
  ITGlueValidationError,
  ITGlueAuthenticationError,
  ITGlueRateLimitError,
} from 'node-it-glue';

try {
  await client.organizations.get('12345');
} catch (error) {
  if (error instanceof ITGlueNotFoundError) {
    console.error('Organization not found');
  } else if (error instanceof ITGlueValidationError) {
    console.error('Validation errors:', error.getErrorMessages());
  } else if (error instanceof ITGlueAuthenticationError) {
    console.error('Invalid API key');
  } else if (error instanceof ITGlueRateLimitError) {
    console.error('Rate limited, retry after:', error.retryAfter);
  } else {
    throw error;
  }
}
```

## Available Resources

### Organizations

```typescript
// List
const { data, meta } = await client.organizations.list(params?);

// List all (auto-paginate)
for await (const org of client.organizations.listAll(params?)) { }

// Get
const org = await client.organizations.get(id, params?);

// Create
const newOrg = await client.organizations.create(data);

// Update
const updated = await client.organizations.update(id, data);

// Delete
await client.organizations.delete(id);
```

### Organization Types

```typescript
const { data } = await client.organizationTypes.list(params?);
const newType = await client.organizationTypes.create(data);
const updated = await client.organizationTypes.update(id, data);
```

### Organization Statuses

```typescript
const { data } = await client.organizationStatuses.list(params?);
const newStatus = await client.organizationStatuses.create(data);
const updated = await client.organizationStatuses.update(id, data);
```

*Additional resources (configurations, contacts, documents, passwords, flexible assets, etc.) follow the same patterns and will be documented as they are implemented.*

## Rate Limiting

The library automatically handles IT Glue's rate limits (3000 requests per 5 minutes):

- **Request tracking** - Counts requests within the rolling window
- **Preemptive throttling** - Slows down when approaching the limit (default: 80%)
- **429 handling** - Automatically retries with exponential backoff
- **Configurable** - Adjust thresholds or disable entirely

Monitor rate limit status:

```typescript
const status = client.getRateLimitStatus();
console.log(`Requests: ${status.currentCount}/${status.maxRequests}`);
console.log(`Remaining: ${status.remaining}`);
console.log(`Is throttling: ${status.isThrottling}`);
```

## JSON:API Handling

IT Glue uses the JSON:API specification. This library transparently handles:

- **Deserialization** - Flattens `attributes` and converts kebab-case to camelCase
- **Serialization** - Wraps data in JSON:API envelope for POST/PATCH requests
- **Relationships** - Preserves relationship links in a normalized format
- **Pagination meta** - Converts pagination info to camelCase

Raw API response:
```json
{
  "data": {
    "id": "123",
    "type": "organizations",
    "attributes": {
      "name": "Acme Corp",
      "organization-type-name": "Customer",
      "created-at": "2024-01-15T10:30:00.000Z"
    }
  }
}
```

Deserialized client response:
```typescript
{
  id: '123',
  type: 'organizations',
  name: 'Acme Corp',
  organizationTypeName: 'Customer',
  createdAt: '2024-01-15T10:30:00.000Z'
}
```

## Development

```bash
# Install dependencies
npm install

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Type checking
npm run typecheck

# Build
npm run build
```

## License

Apache-2.0

## Contributing

Contributions are welcome! Please read our contributing guidelines before submitting a pull request.
