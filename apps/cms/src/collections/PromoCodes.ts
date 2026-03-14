import type { CmsCollection } from '../payload-like.js';

import { canManageProperty, propertyRelationScope } from '../auth/tenant-access.js';

export const PromoCodes: CmsCollection = {
  slug: 'promoCodes',
  access: {
    read: ({ req }) => propertyRelationScope(req, 'property'),
    create: ({ req }) => canManageProperty(req),
    update: ({ req }) => propertyRelationScope(req, 'property'),
    delete: ({ req }) => propertyRelationScope(req, 'property')
  },
  fields: [
    { name: 'property', type: 'relationship', relationTo: 'properties', required: true },
    { name: 'code', type: 'text', required: true },
    { name: 'type', type: 'select', options: ['percentage', 'fixed'], required: true },
    { name: 'value', type: 'number', required: true },
    { name: 'validFrom', type: 'date', required: true },
    { name: 'validTo', type: 'date', required: true },
    { name: 'maxUses', type: 'number' },
    { name: 'minStay', type: 'number' },
    { name: 'minAmount', type: 'number' },
    { name: 'active', type: 'checkbox', defaultValue: true }
  ]
};
