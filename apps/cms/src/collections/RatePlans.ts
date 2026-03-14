import type { CmsCollection } from '../payload-like.js';

import { canManageProperty, propertyRelationScope } from '../auth/tenant-access.js';

export const RatePlans: CmsCollection = {
  slug: 'ratePlans',
  access: {
    read: ({ req }) => propertyRelationScope(req, 'property'),
    create: ({ req }) => canManageProperty(req),
    update: ({ req }) => propertyRelationScope(req, 'property'),
    delete: ({ req }) => propertyRelationScope(req, 'property')
  },
  fields: [
    { name: 'property', type: 'relationship', relationTo: 'properties', required: true },
    { name: 'roomType', type: 'relationship', relationTo: 'roomTypes', required: true },
    { name: 'name', type: 'text', required: true },
    { name: 'code', type: 'text', required: true },
    { name: 'cancellationPolicy', type: 'textarea', required: true },
    { name: 'paymentPolicy', type: 'textarea', required: true },
    { name: 'minStayDefault', type: 'number', required: true },
    { name: 'maxStayDefault', type: 'number', required: true },
    { name: 'active', type: 'checkbox', defaultValue: true }
  ]
};
