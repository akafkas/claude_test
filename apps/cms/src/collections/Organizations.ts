import type { CmsCollection } from '../payload-like.js';

import { canManageOrganization, organizationScope } from '../auth/tenant-access.js';

export const Organizations: CmsCollection = {
  slug: 'organizations',
  access: {
    read: ({ req }) => organizationScope(req),
    create: ({ req }) => canManageOrganization(req),
    update: ({ req }) => organizationScope(req),
    delete: ({ req }) => Boolean(req.user?.isSuperAdmin)
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true
    },
    {
      name: 'slug',
      type: 'text',
      required: true
    },
    {
      name: 'billingEmail',
      type: 'email',
      required: true
    },
    {
      name: 'active',
      type: 'checkbox',
      defaultValue: true
    }
  ]
};
