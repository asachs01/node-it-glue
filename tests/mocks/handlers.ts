/**
 * MSW request handlers for IT Glue API mocking
 */

import { http, HttpResponse } from 'msw';

const BASE_URL = 'https://api.itglue.com';

/**
 * Sample organization data in JSON:API format
 */
const organizationsPage1 = {
  data: [
    {
      id: '1',
      type: 'organizations',
      attributes: {
        name: 'Acme Corp',
        'organization-type-name': 'Customer',
        'organization-status-name': 'Active',
        'created-at': '2024-01-15T10:30:00.000Z',
        'updated-at': '2024-06-20T14:22:00.000Z',
      },
      relationships: {
        locations: {
          data: [{ id: '456', type: 'locations' }],
        },
      },
    },
    {
      id: '2',
      type: 'organizations',
      attributes: {
        name: 'Contoso Ltd',
        'organization-type-name': 'Customer',
        'organization-status-name': 'Active',
        'created-at': '2024-02-10T09:15:00.000Z',
        'updated-at': '2024-05-18T11:45:00.000Z',
      },
      relationships: {
        locations: {
          data: [],
        },
      },
    },
  ],
  meta: {
    'current-page': 1,
    'next-page': 2,
    'prev-page': null,
    'total-pages': 2,
    'total-count': 4,
  },
};

const organizationsPage2 = {
  data: [
    {
      id: '3',
      type: 'organizations',
      attributes: {
        name: 'Fabrikam Inc',
        'organization-type-name': 'Prospect',
        'organization-status-name': 'Active',
        'created-at': '2024-03-05T08:00:00.000Z',
        'updated-at': '2024-04-22T16:30:00.000Z',
      },
      relationships: {
        locations: {
          data: null,
        },
      },
    },
    {
      id: '4',
      type: 'organizations',
      attributes: {
        name: 'Northwind Traders',
        'organization-type-name': 'Customer',
        'organization-status-name': 'Inactive',
        'created-at': '2024-01-20T14:45:00.000Z',
        'updated-at': '2024-02-28T10:00:00.000Z',
      },
      relationships: {},
    },
  ],
  meta: {
    'current-page': 2,
    'next-page': null,
    'prev-page': 1,
    'total-pages': 2,
    'total-count': 4,
  },
};

const singleOrganization = {
  data: {
    id: '1',
    type: 'organizations',
    attributes: {
      name: 'Acme Corp',
      'organization-type-name': 'Customer',
      'organization-status-name': 'Active',
      description: 'A sample organization',
      'quick-notes': 'Important customer',
      'created-at': '2024-01-15T10:30:00.000Z',
      'updated-at': '2024-06-20T14:22:00.000Z',
    },
    relationships: {
      locations: {
        data: [{ id: '456', type: 'locations' }],
      },
    },
  },
};

const createdOrganization = {
  data: {
    id: '100',
    type: 'organizations',
    attributes: {
      name: 'New Organization',
      'organization-type-id': 1,
      'organization-status-id': 1,
      'created-at': '2026-02-04T12:00:00.000Z',
      'updated-at': '2026-02-04T12:00:00.000Z',
    },
    relationships: {},
  },
};

const updatedOrganization = {
  data: {
    id: '1',
    type: 'organizations',
    attributes: {
      name: 'Updated Acme Corp',
      'organization-type-name': 'Customer',
      'organization-status-name': 'Active',
      'created-at': '2024-01-15T10:30:00.000Z',
      'updated-at': '2026-02-04T12:00:00.000Z',
    },
    relationships: {},
  },
};

/**
 * Organization Types data
 */
const organizationTypes = {
  data: [
    {
      id: '1',
      type: 'organization-types',
      attributes: {
        name: 'Customer',
        'created-at': '2024-01-01T00:00:00.000Z',
        'updated-at': '2024-01-01T00:00:00.000Z',
      },
    },
    {
      id: '2',
      type: 'organization-types',
      attributes: {
        name: 'Prospect',
        'created-at': '2024-01-01T00:00:00.000Z',
        'updated-at': '2024-01-01T00:00:00.000Z',
      },
    },
  ],
  meta: {
    'current-page': 1,
    'next-page': null,
    'prev-page': null,
    'total-pages': 1,
    'total-count': 2,
  },
};

/**
 * Organization Statuses data
 */
const organizationStatuses = {
  data: [
    {
      id: '1',
      type: 'organization-statuses',
      attributes: {
        name: 'Active',
        'created-at': '2024-01-01T00:00:00.000Z',
        'updated-at': '2024-01-01T00:00:00.000Z',
      },
    },
    {
      id: '2',
      type: 'organization-statuses',
      attributes: {
        name: 'Inactive',
        'created-at': '2024-01-01T00:00:00.000Z',
        'updated-at': '2024-01-01T00:00:00.000Z',
      },
    },
  ],
  meta: {
    'current-page': 1,
    'next-page': null,
    'prev-page': null,
    'total-pages': 1,
    'total-count': 2,
  },
};

/**
 * Error responses
 */
const notFoundError = {
  errors: [
    {
      status: '404',
      title: 'Not Found',
      detail: 'The requested resource could not be found.',
    },
  ],
};

const validationError = {
  errors: [
    {
      status: '422',
      title: 'Unprocessable Entity',
      detail: 'Name is required',
      source: {
        pointer: '/data/attributes/name',
      },
    },
  ],
};

const authenticationError = {
  errors: [
    {
      status: '401',
      title: 'Unauthorized',
      detail: 'Invalid API key',
    },
  ],
};

/**
 * MSW handlers for IT Glue API
 */
export const handlers = [
  // Organizations - List
  http.get(`${BASE_URL}/organizations`, ({ request }) => {
    const url = new URL(request.url);
    const page = url.searchParams.get('page[number]') || '1';

    // Check for authentication
    const apiKey = request.headers.get('x-api-key');
    if (!apiKey || !apiKey.startsWith('ITG.')) {
      return HttpResponse.json(authenticationError, { status: 401 });
    }

    if (page === '2') {
      return HttpResponse.json(organizationsPage2);
    }
    return HttpResponse.json(organizationsPage1);
  }),

  // Organizations - Get single
  http.get(`${BASE_URL}/organizations/:id`, ({ request, params }) => {
    const apiKey = request.headers.get('x-api-key');
    if (!apiKey || !apiKey.startsWith('ITG.')) {
      return HttpResponse.json(authenticationError, { status: 401 });
    }

    const { id } = params;
    if (id === '1') {
      return HttpResponse.json(singleOrganization);
    }
    if (id === '999') {
      return HttpResponse.json(notFoundError, { status: 404 });
    }
    return HttpResponse.json(notFoundError, { status: 404 });
  }),

  // Organizations - Create
  http.post(`${BASE_URL}/organizations`, async ({ request }) => {
    const apiKey = request.headers.get('x-api-key');
    if (!apiKey || !apiKey.startsWith('ITG.')) {
      return HttpResponse.json(authenticationError, { status: 401 });
    }

    const body = await request.json() as { data?: { attributes?: { name?: string } } };

    // Validate required fields
    if (!body?.data?.attributes?.name) {
      return HttpResponse.json(validationError, { status: 422 });
    }

    return HttpResponse.json(createdOrganization, { status: 201 });
  }),

  // Organizations - Update
  http.patch(`${BASE_URL}/organizations/:id`, async ({ request, params }) => {
    const apiKey = request.headers.get('x-api-key');
    if (!apiKey || !apiKey.startsWith('ITG.')) {
      return HttpResponse.json(authenticationError, { status: 401 });
    }

    const { id } = params;
    if (id === '999') {
      return HttpResponse.json(notFoundError, { status: 404 });
    }

    return HttpResponse.json(updatedOrganization);
  }),

  // Organizations - Delete
  http.delete(`${BASE_URL}/organizations/:id`, ({ request, params }) => {
    const apiKey = request.headers.get('x-api-key');
    if (!apiKey || !apiKey.startsWith('ITG.')) {
      return HttpResponse.json(authenticationError, { status: 401 });
    }

    const { id } = params;
    if (id === '999') {
      return HttpResponse.json(notFoundError, { status: 404 });
    }

    return new HttpResponse(null, { status: 204 });
  }),

  // Organization Types - List
  http.get(`${BASE_URL}/organization_types`, ({ request }) => {
    const apiKey = request.headers.get('x-api-key');
    if (!apiKey || !apiKey.startsWith('ITG.')) {
      return HttpResponse.json(authenticationError, { status: 401 });
    }
    return HttpResponse.json(organizationTypes);
  }),

  // Organization Types - Create
  http.post(`${BASE_URL}/organization_types`, async ({ request }) => {
    const apiKey = request.headers.get('x-api-key');
    if (!apiKey || !apiKey.startsWith('ITG.')) {
      return HttpResponse.json(authenticationError, { status: 401 });
    }

    return HttpResponse.json({
      data: {
        id: '10',
        type: 'organization-types',
        attributes: {
          name: 'New Type',
          'created-at': '2026-02-04T12:00:00.000Z',
          'updated-at': '2026-02-04T12:00:00.000Z',
        },
      },
    }, { status: 201 });
  }),

  // Organization Types - Update
  http.patch(`${BASE_URL}/organization_types/:id`, async ({ request }) => {
    const apiKey = request.headers.get('x-api-key');
    if (!apiKey || !apiKey.startsWith('ITG.')) {
      return HttpResponse.json(authenticationError, { status: 401 });
    }

    return HttpResponse.json({
      data: {
        id: '1',
        type: 'organization-types',
        attributes: {
          name: 'Updated Type',
          'created-at': '2024-01-01T00:00:00.000Z',
          'updated-at': '2026-02-04T12:00:00.000Z',
        },
      },
    });
  }),

  // Organization Statuses - List
  http.get(`${BASE_URL}/organization_statuses`, ({ request }) => {
    const apiKey = request.headers.get('x-api-key');
    if (!apiKey || !apiKey.startsWith('ITG.')) {
      return HttpResponse.json(authenticationError, { status: 401 });
    }
    return HttpResponse.json(organizationStatuses);
  }),

  // Organization Statuses - Create
  http.post(`${BASE_URL}/organization_statuses`, async ({ request }) => {
    const apiKey = request.headers.get('x-api-key');
    if (!apiKey || !apiKey.startsWith('ITG.')) {
      return HttpResponse.json(authenticationError, { status: 401 });
    }

    return HttpResponse.json({
      data: {
        id: '10',
        type: 'organization-statuses',
        attributes: {
          name: 'New Status',
          'created-at': '2026-02-04T12:00:00.000Z',
          'updated-at': '2026-02-04T12:00:00.000Z',
        },
      },
    }, { status: 201 });
  }),

  // Organization Statuses - Update
  http.patch(`${BASE_URL}/organization_statuses/:id`, async ({ request }) => {
    const apiKey = request.headers.get('x-api-key');
    if (!apiKey || !apiKey.startsWith('ITG.')) {
      return HttpResponse.json(authenticationError, { status: 401 });
    }

    return HttpResponse.json({
      data: {
        id: '1',
        type: 'organization-statuses',
        attributes: {
          name: 'Updated Status',
          'created-at': '2024-01-01T00:00:00.000Z',
          'updated-at': '2026-02-04T12:00:00.000Z',
        },
      },
    });
  }),

  // Rate limit simulation endpoint
  http.get(`${BASE_URL}/rate-limited`, () => {
    return new HttpResponse(null, { status: 429 });
  }),

  // Server error simulation endpoint
  http.get(`${BASE_URL}/server-error`, () => {
    return HttpResponse.json(
      { errors: [{ title: 'Internal Server Error' }] },
      { status: 500 }
    );
  }),
];
