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

### Configurations

```typescript
// List all configurations
const { data } = await client.configurations.list();

// List configurations for an organization
const { data } = await client.configurations.listByOrg(orgId);

// Get with related data
const config = await client.configurations.get(id, {
  include: 'configuration_interfaces,related_items',
});

// Create
const newConfig = await client.configurations.create({
  organizationId: 123,
  configurationTypeId: 1,
  name: 'Server-01',
});
```

### Configuration Types, Statuses, Interfaces

```typescript
// Configuration Types
const { data } = await client.configurationTypes.list();
const type = await client.configurationTypes.create({ name: 'Server' });

// Configuration Statuses
const { data } = await client.configurationStatuses.list();
const status = await client.configurationStatuses.create({ name: 'Active' });

// Configuration Interfaces (nested under configurations)
const { data } = await client.configurationInterfaces.listByConfig(configId);
const iface = await client.configurationInterfaces.create({
  configurationId: 123,
  name: 'eth0',
  ipAddress: '192.168.1.1',
});
```

### Contacts

```typescript
// List contacts
const { data } = await client.contacts.list();

// List contacts for an organization
const { data } = await client.contacts.listByOrg(orgId);

// Create a contact
const contact = await client.contacts.create({
  organizationId: 123,
  firstName: 'John',
  lastName: 'Doe',
  contactTypeId: 1,
});
```

### Contact Types

```typescript
const { data } = await client.contactTypes.list();
const type = await client.contactTypes.create({ name: 'Technical' });
```

### Documents

```typescript
// List documents
const { data } = await client.documents.list();

// List documents for an organization
const { data } = await client.documents.listByOrg(orgId);

// Create a document
const doc = await client.documents.create({
  organizationId: 123,
  name: 'Network Diagram',
});

// Publish a document
await client.documents.publish(docId);
```

### Document Sections and Images

```typescript
// Document Sections
const { data } = await client.documentSections.listByDoc(docId);
const section = await client.documentSections.create(docId, {
  name: 'Overview',
  content: '<p>Introduction...</p>',
});

// Document Images
const { data } = await client.documentImages.list();
const image = await client.documentImages.create({
  documentId: 123,
  content: base64ImageData,
});
```

### Passwords

```typescript
// List passwords (values hidden by default)
const { data } = await client.passwords.list();

// List passwords with values visible
const { data } = await client.passwords.list({ showPassword: true });

// Get a password with value
const pwd = await client.passwords.get(id, { showPassword: true });

// Create a password
const newPwd = await client.passwords.create({
  organizationId: 123,
  name: 'Admin Password',
  password: 'secret123',
  passwordCategoryId: 1,
});
```

### Password Categories and Folders

```typescript
// Password Categories
const { data } = await client.passwordCategories.list();
const cat = await client.passwordCategories.create({ name: 'Server Credentials' });

// Password Folders (nested under organizations)
const { data } = await client.passwordFolders.listByOrg(orgId);
const folder = await client.passwordFolders.create(orgId, { name: 'Production' });
```

### Flexible Assets

```typescript
// List flexible asset types
const { data: types } = await client.flexibleAssetTypes.list();

// List flexible assets (requires filter)
const { data } = await client.flexibleAssets.list({
  filter: { flexibleAssetTypeId: 123 },
});

// Create a flexible asset
const asset = await client.flexibleAssets.create({
  organizationId: 123,
  flexibleAssetTypeId: 456,
  traits: {
    'custom-field-1': 'value1',
    'custom-field-2': 'value2',
  },
});
```

### Flexible Asset Types and Fields

```typescript
// Flexible Asset Types
const { data } = await client.flexibleAssetTypes.list();
const type = await client.flexibleAssetTypes.create({
  name: 'Network Documentation',
  icon: 'sitemap',
});

// Flexible Asset Fields (nested under types)
const { data } = await client.flexibleAssetFields.listByType(typeId);
const field = await client.flexibleAssetFields.create({
  flexibleAssetTypeId: 123,
  name: 'IP Range',
  kind: 'Text',
});
```

### Locations

```typescript
// List locations for an organization
const { data } = await client.locations.listByOrg(orgId);

// Create a location
const loc = await client.locations.create({
  organizationId: 123,
  name: 'Main Office',
  addressLine1: '123 Main St',
  city: 'Springfield',
  postalCode: '12345',
  countryId: 1,
  regionId: 1,
});
```

### Users and Groups

```typescript
// Users (read-only creation, can update)
const { data } = await client.users.list();
const user = await client.users.get(userId);
const updated = await client.users.update(userId, { firstName: 'Jane' });

// Bulk update users
const results = await client.users.bulkUpdate({
  users: [
    { id: 1, firstName: 'Jane' },
    { id: 2, lastName: 'Smith' },
  ],
});

// User Metrics
const { data } = await client.userMetrics.list({
  filter: { userId: 123, date: '2024-01-01' },
});

// Groups
const { data } = await client.groups.list();
const group = await client.groups.create({ name: 'Admins' });
```

### Metadata Resources

```typescript
// Manufacturers
const { data } = await client.manufacturers.list();
const mfg = await client.manufacturers.create({ name: 'Dell' });

// Models (nested under manufacturers)
const { data } = await client.models.listByManufacturer(mfgId);
const model = await client.models.create({ manufacturerId: 1, name: 'PowerEdge R640' });

// Platforms (read-only)
const { data } = await client.platforms.list();

// Operating Systems (read-only)
const { data } = await client.operatingSystems.list();

// Countries (read-only)
const { data } = await client.countries.list();
const country = await client.countries.get(countryId);

// Regions (nested under countries, read-only)
const { data } = await client.regions.listByCountry(countryId);
```

### Miscellaneous Resources

```typescript
// Domains (nested under organizations, read-only)
const { data } = await client.domains.listByOrg(orgId);

// Expirations (read-only)
const { data } = await client.expirations.list();
const exp = await client.expirations.get(expId);

// Logs (read-only)
const { data } = await client.logs.list();
for await (const log of client.logs.listAll()) {
  console.log(log.action);
}

// Attachments (nested under various resources)
const { data } = await client.attachments.list('configurations', configId);
const att = await client.attachments.create('configurations', configId, {
  name: 'diagram.png',
  content: base64Data,
});
await client.attachments.delete('configurations', configId, attachmentId);

// Related Items
await client.relatedItems.create('configurations', configId, {
  destinationType: 'passwords',
  destinationId: passwordId,
});
await client.relatedItems.delete('configurations', configId, relatedItemId);

// Exports
const exportJob = await client.exports.create({
  organizationIds: [123, 456],
  includePasswords: true,
});
const status = await client.exports.get(exportJob.id);

// Checklists (nested under organizations)
const { data } = await client.checklists.listByOrg(orgId);
const checklist = await client.checklists.get(checklistId);
const updated = await client.checklists.update(checklistId, { completed: true });
```

## Complete Resource Reference

| Resource | Methods |
|----------|---------|
| `organizations` | list, listAll, get, create, update, delete |
| `organizationTypes` | list, listAll, get, create, update |
| `organizationStatuses` | list, listAll, get, create, update |
| `configurations` | list, listAll, listByOrg, listAllByOrg, get, create, update, delete |
| `configurationTypes` | list, listAll, get, create, update, delete |
| `configurationStatuses` | list, listAll, get, create, update, delete |
| `configurationInterfaces` | listByConfig, create, update, delete |
| `contacts` | list, listAll, listByOrg, listAllByOrg, get, create, update, delete |
| `contactTypes` | list, listAll, get, create, update |
| `documents` | list, listAll, listByOrg, listAllByOrg, get, create, update, delete, publish |
| `documentSections` | listByDoc, create, update, delete |
| `documentImages` | list, create, delete |
| `passwords` | list, listAll, listByOrg, listAllByOrg, get, create, update, delete |
| `passwordCategories` | list, listAll, get, create, update, delete |
| `passwordFolders` | listByOrg, create, update, delete |
| `flexibleAssetTypes` | list, listAll, get, create, update, delete |
| `flexibleAssetFields` | listByType, create, update, delete |
| `flexibleAssets` | list, listAll, get, create, update, delete |
| `locations` | listByOrg, create, update, delete |
| `users` | list, listAll, get, update, bulkUpdate |
| `userMetrics` | list, listAll |
| `groups` | list, listAll, get, create, update, delete |
| `manufacturers` | list, listAll, get, create, update |
| `models` | listByManufacturer, create, update |
| `platforms` | list |
| `operatingSystems` | list |
| `countries` | list, listAll, get |
| `regions` | listByCountry |
| `domains` | listByOrg |
| `expirations` | list, listAll, get |
| `logs` | list, listAll |
| `attachments` | list, create, update, delete |
| `relatedItems` | create, update, delete |
| `exports` | list, listAll, get, create, delete |
| `checklists` | listByOrg, get, update, delete |

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
