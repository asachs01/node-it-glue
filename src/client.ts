/**
 * IT Glue API Client
 * Main entry point for interacting with the IT Glue API
 */

import type { ITGlueClientConfig } from './types/index.js';
import { resolveConfig, type ResolvedConfig } from './config.js';
import { HttpClient } from './http.js';
import { RateLimiter } from './rate-limiter.js';
import {
  // Organizations
  OrganizationsResource,
  OrganizationTypesResource,
  OrganizationStatusesResource,
  // Configurations
  ConfigurationsResource,
  ConfigurationTypesResource,
  ConfigurationStatusesResource,
  ConfigurationInterfacesResource,
  // Contacts
  ContactsResource,
  ContactTypesResource,
  // Documents
  DocumentsResource,
  DocumentSectionsResource,
  DocumentImagesResource,
  // Passwords
  PasswordsResource,
  PasswordCategoriesResource,
  PasswordFoldersResource,
  // Flexible Assets
  FlexibleAssetTypesResource,
  FlexibleAssetFieldsResource,
  FlexibleAssetsResource,
  // Locations
  LocationsResource,
  // Users
  UsersResource,
  UserMetricsResource,
  GroupsResource,
  // Metadata
  ManufacturersResource,
  ModelsResource,
  PlatformsResource,
  OperatingSystemsResource,
  CountriesResource,
  RegionsResource,
  // Misc
  DomainsResource,
  ExpirationsResource,
  LogsResource,
  AttachmentsResource,
  RelatedItemsResource,
  ExportsResource,
  ChecklistsResource,
} from './resources/index.js';

/**
 * IT Glue API Client
 *
 * Provides access to all IT Glue API resources with automatic pagination,
 * rate limiting, and JSON:API handling.
 *
 * @example
 * ```typescript
 * import { ITGlueClient } from 'node-it-glue';
 *
 * const client = new ITGlueClient({
 *   apiKey: 'ITG.xxxxxxxxxxxxxxxx',
 *   region: 'us', // 'us' | 'eu' | 'au'
 * });
 *
 * // List organizations
 * const { data, meta } = await client.organizations.list({
 *   filter: { organizationStatusId: 1 },
 *   page: { size: 50 },
 * });
 *
 * // Auto-paginate through all organizations
 * for await (const org of client.organizations.listAll()) {
 *   console.log(org.name);
 * }
 * ```
 */
export class ITGlueClient {
  private readonly config: ResolvedConfig;
  private readonly http: HttpClient;

  // Organizations
  public readonly organizations: OrganizationsResource;
  public readonly organizationTypes: OrganizationTypesResource;
  public readonly organizationStatuses: OrganizationStatusesResource;

  // Configurations
  public readonly configurations: ConfigurationsResource;
  public readonly configurationTypes: ConfigurationTypesResource;
  public readonly configurationStatuses: ConfigurationStatusesResource;
  public readonly configurationInterfaces: ConfigurationInterfacesResource;

  // Contacts
  public readonly contacts: ContactsResource;
  public readonly contactTypes: ContactTypesResource;

  // Documents
  public readonly documents: DocumentsResource;
  public readonly documentSections: DocumentSectionsResource;
  public readonly documentImages: DocumentImagesResource;

  // Passwords
  public readonly passwords: PasswordsResource;
  public readonly passwordCategories: PasswordCategoriesResource;
  public readonly passwordFolders: PasswordFoldersResource;

  // Flexible Assets
  public readonly flexibleAssetTypes: FlexibleAssetTypesResource;
  public readonly flexibleAssetFields: FlexibleAssetFieldsResource;
  public readonly flexibleAssets: FlexibleAssetsResource;

  // Locations
  public readonly locations: LocationsResource;

  // Users
  public readonly users: UsersResource;
  public readonly userMetrics: UserMetricsResource;
  public readonly groups: GroupsResource;

  // Metadata
  public readonly manufacturers: ManufacturersResource;
  public readonly models: ModelsResource;
  public readonly platforms: PlatformsResource;
  public readonly operatingSystems: OperatingSystemsResource;
  public readonly countries: CountriesResource;
  public readonly regions: RegionsResource;

  // Misc
  public readonly domains: DomainsResource;
  public readonly expirations: ExpirationsResource;
  public readonly logs: LogsResource;
  public readonly attachments: AttachmentsResource;
  public readonly relatedItems: RelatedItemsResource;
  public readonly exports: ExportsResource;
  public readonly checklists: ChecklistsResource;

  /**
   * Create a new IT Glue API client
   *
   * @param config - Client configuration options
   * @throws {Error} If the API key is missing or invalid
   */
  constructor(config: ITGlueClientConfig) {
    this.config = resolveConfig(config);
    this.http = new HttpClient(this.config);

    // Initialize all resources
    // Organizations
    this.organizations = new OrganizationsResource(this.http);
    this.organizationTypes = new OrganizationTypesResource(this.http);
    this.organizationStatuses = new OrganizationStatusesResource(this.http);

    // Configurations
    this.configurations = new ConfigurationsResource(this.http);
    this.configurationTypes = new ConfigurationTypesResource(this.http);
    this.configurationStatuses = new ConfigurationStatusesResource(this.http);
    this.configurationInterfaces = new ConfigurationInterfacesResource(this.http);

    // Contacts
    this.contacts = new ContactsResource(this.http);
    this.contactTypes = new ContactTypesResource(this.http);

    // Documents
    this.documents = new DocumentsResource(this.http);
    this.documentSections = new DocumentSectionsResource(this.http);
    this.documentImages = new DocumentImagesResource(this.http);

    // Passwords
    this.passwords = new PasswordsResource(this.http);
    this.passwordCategories = new PasswordCategoriesResource(this.http);
    this.passwordFolders = new PasswordFoldersResource(this.http);

    // Flexible Assets
    this.flexibleAssetTypes = new FlexibleAssetTypesResource(this.http);
    this.flexibleAssetFields = new FlexibleAssetFieldsResource(this.http);
    this.flexibleAssets = new FlexibleAssetsResource(this.http);

    // Locations
    this.locations = new LocationsResource(this.http);

    // Users
    this.users = new UsersResource(this.http);
    this.userMetrics = new UserMetricsResource(this.http);
    this.groups = new GroupsResource(this.http);

    // Metadata
    this.manufacturers = new ManufacturersResource(this.http);
    this.models = new ModelsResource(this.http);
    this.platforms = new PlatformsResource(this.http);
    this.operatingSystems = new OperatingSystemsResource(this.http);
    this.countries = new CountriesResource(this.http);
    this.regions = new RegionsResource(this.http);

    // Misc
    this.domains = new DomainsResource(this.http);
    this.expirations = new ExpirationsResource(this.http);
    this.logs = new LogsResource(this.http);
    this.attachments = new AttachmentsResource(this.http);
    this.relatedItems = new RelatedItemsResource(this.http);
    this.exports = new ExportsResource(this.http);
    this.checklists = new ChecklistsResource(this.http);
  }

  /**
   * Get the resolved configuration
   * Useful for debugging and testing
   */
  getConfig(): Readonly<ResolvedConfig> {
    return { ...this.config };
  }

  /**
   * Get the rate limiter status
   * Useful for monitoring rate limit usage
   *
   * @example
   * ```typescript
   * const status = client.getRateLimitStatus();
   * console.log(`Remaining requests: ${status.remaining}`);
   * ```
   */
  getRateLimitStatus(): ReturnType<RateLimiter['getStatus']> {
    return this.http.getRateLimiter().getStatus();
  }

  /**
   * Get the HTTP client instance
   * For advanced use cases that need direct HTTP access
   */
  getHttpClient(): HttpClient {
    return this.http;
  }
}
