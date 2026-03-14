import type { CmsCollection } from '../payload-like.js';

import { canManageProperty, propertyRelationScope } from '../auth/tenant-access.js';

export const TaxRules: CmsCollection = {
  slug: 'taxRules',
  access: {
    read: ({ req }) => propertyRelationScope(req, 'property'),
    create: ({ req }) => canManageProperty(req),
    update: ({ req }) => propertyRelationScope(req, 'property'),
    delete: ({ req }) => propertyRelationScope(req, 'property')
  },
  fields: [
    { name: 'property', type: 'relationship', relationTo: 'properties', required: true },
    { name: 'name', type: 'text', required: true },
    { name: 'type', type: 'select', options: ['percentage', 'fixed'], required: true },
    { name: 'value', type: 'number', required: true },
    { name: 'active', type: 'checkbox', defaultValue: true }
  ]
};
