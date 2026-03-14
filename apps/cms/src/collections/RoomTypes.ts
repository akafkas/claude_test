import type { CmsCollection } from '../payload-like.js';

import { canManageProperty, propertyRelationScope } from '../auth/tenant-access.js';

export const RoomTypes: CmsCollection = {
  slug: 'roomTypes',
  access: {
    read: ({ req }) => propertyRelationScope(req, 'property'),
    create: ({ req }) => canManageProperty(req),
    update: ({ req }) => propertyRelationScope(req, 'property'),
    delete: ({ req }) => propertyRelationScope(req, 'property')
  },
  fields: [
    { name: 'property', type: 'relationship', relationTo: 'properties', required: true },
    { name: 'name', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true },
    { name: 'description', type: 'textarea' },
    { name: 'maxOccupancy', type: 'number', required: true },
    { name: 'maxAdults', type: 'number', required: true },
    { name: 'maxChildren', type: 'number', required: true },
    { name: 'amenities', type: 'json' },
    { name: 'images', type: 'relationship', relationTo: 'media', hasMany: true },
    { name: 'active', type: 'checkbox', defaultValue: true }
  ]
};
