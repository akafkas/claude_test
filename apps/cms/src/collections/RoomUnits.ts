import type { CmsCollection } from '../payload-like.js';

import { canManageProperty, propertyRelationScope } from '../auth/tenant-access.js';

export const RoomUnits: CmsCollection = {
  slug: 'roomUnits',
  access: {
    read: ({ req }) => propertyRelationScope(req, 'property'),
    create: ({ req }) => canManageProperty(req),
    update: ({ req }) => propertyRelationScope(req, 'property'),
    delete: ({ req }) => propertyRelationScope(req, 'property')
  },
  fields: [
    { name: 'property', type: 'relationship', relationTo: 'properties', required: true },
    { name: 'roomType', type: 'relationship', relationTo: 'roomTypes', required: true },
    { name: 'code', type: 'text', required: true },
    { name: 'active', type: 'checkbox', defaultValue: true }
  ]
};
