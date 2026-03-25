# [1.1.0](https://github.com/wyre-technology/node-it-glue/compare/v1.0.1...v1.1.0) (2026-03-25)


### Features

* **types:** add documentFolderId to DocumentFilter ([5dc282d](https://github.com/wyre-technology/node-it-glue/commit/5dc282d1b1ca0cb6035d8d02f82cc3d927676311))

## [1.0.1](https://github.com/wyre-technology/node-it-glue/compare/v1.0.0...v1.0.1) (2026-03-02)


### Bug Fixes

* require Node 22+ (semantic-release@25 compatibility) ([cfd8ae0](https://github.com/wyre-technology/node-it-glue/commit/cfd8ae0885cd5f10de2fe4d5f0ca67c5debb36f6))
* require Node 22+ (semantic-release@25 compatibility) ([28a390b](https://github.com/wyre-technology/node-it-glue/commit/28a390beec0fc7f95c500ff5f3f9b8f909994730))

# 1.0.0 (2026-02-05)


### Bug Fixes

* Add semantic-release plugins as devDependencies ([e6c7712](https://github.com/asachs01/node-it-glue/commit/e6c771231d30e2bb4b8d7d57bfea61708c573146))


### Features

* Implement remaining resource classes for full API coverage ([238bb51](https://github.com/asachs01/node-it-glue/commit/238bb517f48cd313a1d2189cf2353e751972d0e9))
* Initial project setup with core infrastructure ([75c1acf](https://github.com/asachs01/node-it-glue/commit/75c1acf160d75362f9e4ded1fc4a098aa81f010e))

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
