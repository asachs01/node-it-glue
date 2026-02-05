# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.1.0] - 2026-02-04

### Added

- Initial release of node-it-glue library with full API coverage
- Core infrastructure:
  - `ITGlueClient` main client class with 27 resource properties
  - HTTP client with fetch wrapper and automatic retries
  - JSON:API serialization/deserialization with kebab-to-camel case conversion
  - Rate limiting (3000 req / 5 min) with throttling and exponential backoff
  - Automatic pagination with async iterators and helper methods (toArray, take)
  - Regional support (US, EU, AU)
- Error handling:
  - `ITGlueError` base error class
  - `ITGlueAuthenticationError` for 401/403 responses
  - `ITGlueNotFoundError` for 404 responses
  - `ITGlueValidationError` for 422 responses with error details
  - `ITGlueRateLimitError` for 429 responses
  - `ITGlueServerError` for 5xx responses
  - `ITGlueNetworkError` for network-level errors
  - `ITGlueTimeoutError` for request timeouts
- Complete resource implementations:
  - Organizations (list, listAll, get, create, update, delete)
  - Organization Types (list, listAll, get, create, update)
  - Organization Statuses (list, listAll, get, create, update)
  - Configurations (list, listAll, listByOrg, listAllByOrg, get, create, update, delete)
  - Configuration Types (list, listAll, get, create, update, delete)
  - Configuration Statuses (list, listAll, get, create, update, delete)
  - Configuration Interfaces (listByConfig, create, update, delete)
  - Contacts (list, listAll, listByOrg, listAllByOrg, get, create, update, delete)
  - Contact Types (list, listAll, get, create, update)
  - Documents (list, listAll, listByOrg, listAllByOrg, get, create, update, delete, publish)
  - Document Sections (listByDoc, create, update, delete)
  - Document Images (list, create, delete)
  - Passwords (list, listAll, listByOrg, listAllByOrg, get, create, update, delete) with showPassword support
  - Password Categories (list, listAll, get, create, update, delete)
  - Password Folders (listByOrg, create, update, delete)
  - Flexible Asset Types (list, listAll, get, create, update, delete)
  - Flexible Asset Fields (listByType, create, update, delete)
  - Flexible Assets (list, listAll, get, create, update, delete)
  - Locations (listByOrg, create, update, delete)
  - Users (list, listAll, get, update, bulkUpdate) - read-only creation
  - User Metrics (list, listAll)
  - Groups (list, listAll, get, create, update, delete)
  - Manufacturers (list, listAll, get, create, update)
  - Models (listByManufacturer, create, update)
  - Platforms (list) - read-only
  - Operating Systems (list) - read-only
  - Countries (list, listAll, get) - read-only
  - Regions (listByCountry) - read-only
  - Domains (listByOrg) - read-only
  - Expirations (list, listAll, get) - read-only
  - Logs (list, listAll) - read-only
  - Attachments (list, create, update, delete) - nested under various resource types
  - Related Items (create, update, delete)
  - Exports (list, listAll, get, create, delete)
  - Checklists (listByOrg, get, update, delete)
- Full TypeScript type definitions for all resources
- Test infrastructure:
  - Vitest configuration
  - MSW for API mocking
  - 113 tests covering unit and integration scenarios
- Dual build output (ESM and CommonJS)
