import type { CmsCollection } from '../payload-like.js';

import { canManageProperty, propertyRelationScope } from '../auth/tenant-access.js';

export const SeasonRules: CmsCollection = {
  slug: 'seasonRules',
  access: {
    read: ({ req }) => propertyRelationScope(req, 'property'),
    create: ({ req }) => canManageProperty(req),
    update: ({ req }) => propertyRelationScope(req, 'property'),
    delete: ({ req }) => propertyRelationScope(req, 'property')
  },
  fields: [
    { name: 'property', type: 'relationship', relationTo: 'properties', required: true },
    { name: 'ratePlan', type: 'relationship', relationTo: 'ratePlans', required: true },
    { name: 'startDate', type: 'date', required: true },
    { name: 'endDate', type: 'date', required: true },
    { name: 'basePrice', type: 'number', required: true },
    { name: 'weekendPrice', type: 'number' },
    { name: 'extraAdultPrice', type: 'number', defaultValue: 0 },
    { name: 'extraChildPrice', type: 'number', defaultValue: 0 },
    { name: 'minStay', type: 'number' },
    { name: 'maxStay', type: 'number' },
    { name: 'closedToArrival', type: 'checkbox', defaultValue: false },
    { name: 'closedToDeparture', type: 'checkbox', defaultValue: false },
    { name: 'stopSell', type: 'checkbox', defaultValue: false }
  ]
};
