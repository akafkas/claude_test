import type { CmsCollection } from '../payload-like.js';

import { canManageProperty, propertyRelationScope } from '../auth/tenant-access.js';

export const SiteSettings: CmsCollection = {
  slug: 'siteSettings',
  access: {
    read: ({ req }) => propertyRelationScope(req, 'property'),
    create: ({ req }) => canManageProperty(req),
    update: ({ req }) => propertyRelationScope(req, 'property'),
    delete: ({ req }) => Boolean(req.user?.isSuperAdmin)
  },
  fields: [
    { name: 'property', type: 'relationship', relationTo: 'properties', required: true },
    { name: 'logo', type: 'relationship', relationTo: 'media' },
    { name: 'favicon', type: 'relationship', relationTo: 'media' },
    { name: 'primaryColor', type: 'text', required: true },
    { name: 'secondaryColor', type: 'text', required: true },
    { name: 'fonts', type: 'json', required: true },
    { name: 'navLinks', type: 'json', required: true },
    { name: 'footerContent', type: 'json', required: true },
    { name: 'socialLinks', type: 'json' },
    { name: 'seoDefaults', type: 'json', required: true },
    { name: 'analyticsIds', type: 'json' }
  ]
};
