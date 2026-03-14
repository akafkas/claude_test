import type { CmsCollection } from '../payload-like.js';

import { canManageProperty, propertyRelationScope } from '../auth/tenant-access.js';

export const AddOns: CmsCollection = {
  slug: 'addOns',
  access: {
    read: ({ req }) => propertyRelationScope(req, 'property'),
    create: ({ req }) => canManageProperty(req),
    update: ({ req }) => propertyRelationScope(req, 'property'),
    delete: ({ req }) => propertyRelationScope(req, 'property')
  },
  fields: [
    { name: 'property', type: 'relationship', relationTo: 'properties', required: true },
    { name: 'name', type: 'text', required: true },
    { name: 'code', type: 'text', required: true },
    { name: 'description', type: 'textarea' },
    { name: 'priceType', type: 'select', options: ['per_stay', 'per_night'], required: true },
    { name: 'price', type: 'number', required: true },
    { name: 'active', type: 'checkbox', defaultValue: true }
  ]
};
