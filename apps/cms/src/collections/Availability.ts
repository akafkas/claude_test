import type { CmsCollection } from '../payload-like.js';

import { canManageProperty, propertyRelationScope } from '../auth/tenant-access.js';

export const Availability: CmsCollection = {
  slug: 'availability',
  access: {
    read: ({ req }) => propertyRelationScope(req, 'property'),
    create: ({ req }) => canManageProperty(req),
    update: ({ req }) => propertyRelationScope(req, 'property'),
    delete: ({ req }) => propertyRelationScope(req, 'property')
  },
  fields: [
    { name: 'property', type: 'relationship', relationTo: 'properties', required: true },
    { name: 'roomType', type: 'relationship', relationTo: 'roomTypes', required: true },
    { name: 'date', type: 'date', required: true },
    { name: 'totalUnits', type: 'number', required: true },
    { name: 'bookedUnits', type: 'number', defaultValue: 0 },
    { name: 'heldUnits', type: 'number', defaultValue: 0 },
    { name: 'availableUnits', type: 'number', required: true },
    { name: 'stopSell', type: 'checkbox', defaultValue: false },
    { name: 'closedToArrival', type: 'checkbox', defaultValue: false },
    { name: 'closedToDeparture', type: 'checkbox', defaultValue: false },
    { name: 'minStay', type: 'number' },
    { name: 'maxStay', type: 'number' },
    { name: 'overridePrice', type: 'number' }
  ]
};
