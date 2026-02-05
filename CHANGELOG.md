# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.1.0] - 2026-02-04

### Added

- Initial release of node-it-glue library
- Core infrastructure:
  - `ITGlueClient` main client class
  - HTTP client with fetch wrapper
  - JSON:API serialization/deserialization
  - Rate limiting (3000 req / 5 min)
  - Automatic pagination with async iterators
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
- Resources:
  - Organizations (list, listAll, get, create, update, delete)
  - Organization Types (list, listAll, create, update)
  - Organization Statuses (list, listAll, create, update)
- Type definitions for:
  - Organizations and related types
  - Configurations and related types
  - Contacts and related types
  - Documents and related types
  - Passwords and related types
  - Flexible Assets and related types
  - Locations
  - Users and Groups
  - Manufacturers, Models, Platforms, Operating Systems
  - Countries and Regions
  - Domains, Expirations, Logs
  - Attachments and Related Items
  - Exports and Checklists
- Test infrastructure:
  - Vitest configuration
  - MSW for API mocking
  - Unit tests for core utilities
  - Integration tests for Organizations resource

### Notes

- This is the initial Phase 1 release focusing on core foundation
- Additional resources will be implemented in subsequent releases
