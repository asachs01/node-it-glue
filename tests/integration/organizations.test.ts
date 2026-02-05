/**
 * Integration tests for Organizations resource
 */

import { describe, it, expect } from 'vitest';
import { ITGlueClient } from '../../src/client.js';
import {
  ITGlueAuthenticationError,
  ITGlueNotFoundError,
  ITGlueValidationError,
} from '../../src/errors.js';

describe('Organizations resource', () => {
  const client = new ITGlueClient({
    apiKey: 'ITG.test-api-key',
    region: 'us',
  });

  describe('list', () => {
    it('should list organizations', async () => {
      const { data, meta } = await client.organizations.list();

      expect(data).toHaveLength(2);
      expect(data[0].name).toBe('Acme Corp');
      expect(data[0].type).toBe('organizations');
      expect(data[0].organizationTypeName).toBe('Customer');
      expect(meta.currentPage).toBe(1);
      expect(meta.nextPage).toBe(2);
      expect(meta.totalCount).toBe(4);
    });

    it('should list organizations with pagination', async () => {
      const { data, meta } = await client.organizations.list({
        page: { number: 2, size: 50 },
      });

      expect(data).toHaveLength(2);
      expect(data[0].name).toBe('Fabrikam Inc');
      expect(meta.currentPage).toBe(2);
      expect(meta.nextPage).toBeNull();
    });

    it('should handle relationships', async () => {
      const { data } = await client.organizations.list();

      expect(data[0].relationships?.locations).toHaveLength(1);
      expect(data[0].relationships?.locations?.[0].id).toBe('456');
    });
  });

  describe('listAll', () => {
    it('should iterate through all pages', async () => {
      const organizations = [];

      for await (const org of client.organizations.listAll()) {
        organizations.push(org);
      }

      expect(organizations).toHaveLength(4);
      expect(organizations[0].name).toBe('Acme Corp');
      expect(organizations[2].name).toBe('Fabrikam Inc');
    });

    it('should support toArray()', async () => {
      const organizations = await client.organizations.listAll().toArray();

      expect(organizations).toHaveLength(4);
    });
  });

  describe('get', () => {
    it('should get a single organization', async () => {
      const org = await client.organizations.get('1');

      expect(org.id).toBe('1');
      expect(org.name).toBe('Acme Corp');
      expect(org.organizationTypeName).toBe('Customer');
      expect(org.description).toBe('A sample organization');
      expect(org.quickNotes).toBe('Important customer');
    });

    it('should throw ITGlueNotFoundError for non-existent organization', async () => {
      await expect(client.organizations.get('999')).rejects.toThrow(
        ITGlueNotFoundError
      );
    });
  });

  describe('create', () => {
    it('should create an organization', async () => {
      const org = await client.organizations.create({
        name: 'New Organization',
        organizationTypeId: 1,
        organizationStatusId: 1,
      });

      expect(org.id).toBe('100');
      expect(org.name).toBe('New Organization');
    });

    it('should throw ITGlueValidationError for missing required fields', async () => {
      await expect(
        client.organizations.create({} as { name: string })
      ).rejects.toThrow(ITGlueValidationError);
    });
  });

  describe('update', () => {
    it('should update an organization', async () => {
      const org = await client.organizations.update('1', {
        name: 'Updated Acme Corp',
      });

      expect(org.id).toBe('1');
      expect(org.name).toBe('Updated Acme Corp');
    });

    it('should throw ITGlueNotFoundError for non-existent organization', async () => {
      await expect(
        client.organizations.update('999', { name: 'Test' })
      ).rejects.toThrow(ITGlueNotFoundError);
    });
  });

  describe('delete', () => {
    it('should delete an organization', async () => {
      await expect(client.organizations.delete('1')).resolves.toBeUndefined();
    });

    it('should throw ITGlueNotFoundError for non-existent organization', async () => {
      await expect(client.organizations.delete('999')).rejects.toThrow(
        ITGlueNotFoundError
      );
    });
  });

  describe('authentication', () => {
    it('should throw ITGlueAuthenticationError for invalid API key', async () => {
      const badClient = new ITGlueClient({
        apiKey: 'invalid-key',
        region: 'us',
      });

      await expect(badClient.organizations.list()).rejects.toThrow(
        ITGlueAuthenticationError
      );
    });
  });
});

describe('Organization Types resource', () => {
  const client = new ITGlueClient({
    apiKey: 'ITG.test-api-key',
    region: 'us',
  });

  describe('list', () => {
    it('should list organization types', async () => {
      const { data, meta } = await client.organizationTypes.list();

      expect(data).toHaveLength(2);
      expect(data[0].name).toBe('Customer');
      expect(data[1].name).toBe('Prospect');
      expect(meta.totalCount).toBe(2);
    });
  });

  describe('create', () => {
    it('should create an organization type', async () => {
      const type = await client.organizationTypes.create({ name: 'New Type' });

      expect(type.id).toBe('10');
      expect(type.name).toBe('New Type');
    });
  });

  describe('update', () => {
    it('should update an organization type', async () => {
      const type = await client.organizationTypes.update('1', {
        name: 'Updated Type',
      });

      expect(type.id).toBe('1');
      expect(type.name).toBe('Updated Type');
    });
  });
});

describe('Organization Statuses resource', () => {
  const client = new ITGlueClient({
    apiKey: 'ITG.test-api-key',
    region: 'us',
  });

  describe('list', () => {
    it('should list organization statuses', async () => {
      const { data, meta } = await client.organizationStatuses.list();

      expect(data).toHaveLength(2);
      expect(data[0].name).toBe('Active');
      expect(data[1].name).toBe('Inactive');
      expect(meta.totalCount).toBe(2);
    });
  });

  describe('create', () => {
    it('should create an organization status', async () => {
      const status = await client.organizationStatuses.create({ name: 'New Status' });

      expect(status.id).toBe('10');
      expect(status.name).toBe('New Status');
    });
  });

  describe('update', () => {
    it('should update an organization status', async () => {
      const status = await client.organizationStatuses.update('1', {
        name: 'Updated Status',
      });

      expect(status.id).toBe('1');
      expect(status.name).toBe('Updated Status');
    });
  });
});
