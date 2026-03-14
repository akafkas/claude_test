import type { CmsCollection } from '../payload-like.js';

import { canManageProperty, propertyScope } from '../auth/tenant-access.js';

export const Properties: CmsCollection = {
  slug: 'properties',
  access: {
    read: ({ req }) => propertyScope(req),
    create: ({ req }) => canManageProperty(req),
    update: ({ req }) => propertyScope(req),
    delete: ({ req }) => Boolean(req.user?.isSuperAdmin)
  },
  fields: [
    { name: 'organization', type: 'relationship', relationTo: 'organizations', required: true },
    { name: 'name', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true },
    { name: 'type', type: 'text', required: true },
    { name: 'status', type: 'text', required: true },
    { name: 'timezone', type: 'text', required: true },
    { name: 'currency', type: 'text', required: true },
    { name: 'locale', type: 'text', required: true },
    { name: 'domain', type: 'text' },
    { name: 'subdomain', type: 'text' },
    { name: 'contactEmail', type: 'email', required: true },
    { name: 'contactPhone', type: 'text', required: true },
    { name: 'address', type: 'json', required: true },
    { name: 'geo', type: 'json' },
    { name: 'checkInTime', type: 'text', required: true },
    { name: 'checkOutTime', type: 'text', required: true },
    { name: 'bookingEnabled', type: 'checkbox', defaultValue: true },
    { name: 'channelSyncEnabled', type: 'checkbox', defaultValue: false }
  ]
};
