import type { CmsCollection } from '../payload-like.js';

import { selfUserScope } from '../auth/tenant-access.js';

export const Users: CmsCollection = {
  slug: 'users',
  auth: true,
  access: {
    read: ({ req }) => selfUserScope(req),
    update: ({ req }) => selfUserScope(req),
    create: ({ req }) => Boolean(req.user?.isSuperAdmin),
    delete: ({ req }) => Boolean(req.user?.isSuperAdmin)
  },
  fields: [
    {
      name: 'email',
      type: 'email',
      required: true
    },
    {
      name: 'password',
      type: 'password',
      required: true
    },
    {
      name: 'firstName',
      type: 'text',
      required: true
    },
    {
      name: 'lastName',
      type: 'text',
      required: true
    },
    {
      name: 'phone',
      type: 'text'
    },
    {
      name: 'isSuperAdmin',
      type: 'checkbox',
      defaultValue: false
    }
  ]
};
