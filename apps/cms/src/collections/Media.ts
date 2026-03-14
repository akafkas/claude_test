import type { CmsCollection } from '../payload-like.js';

import { canManageProperty, propertyRelationScope } from '../auth/tenant-access.js';

export const Media: CmsCollection = {
  slug: 'media',
  access: {
    read: ({ req }) => propertyRelationScope(req, 'property'),
    create: ({ req }) => canManageProperty(req),
    update: ({ req }) => propertyRelationScope(req, 'property'),
    delete: ({ req }) => propertyRelationScope(req, 'property')
  },
  fields: [
    { name: 'property', type: 'relationship', relationTo: 'properties', required: true },
    { name: 'alt', type: 'text' },
    { name: 'caption', type: 'text' },
    { name: 'fileName', type: 'text', required: true },
    { name: 'mimeType', type: 'text', required: true },
    { name: 'url', type: 'text', required: true }
  ]
};
