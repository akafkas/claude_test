import type { CmsCollection } from '../payload-like.js';

import { canManageOrganization, membershipScope } from '../auth/tenant-access.js';

export const Memberships: CmsCollection = {
  slug: 'memberships',
  access: {
    read: ({ req }) => membershipScope(req),
    create: ({ req }) => canManageOrganization(req),
    update: ({ req }) => canManageOrganization(req),
    delete: ({ req }) => Boolean(req.user?.isSuperAdmin)
  },
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true
    },
    {
      name: 'organization',
      type: 'relationship',
      relationTo: 'organizations',
      required: true
    },
    {
      name: 'role',
      type: 'select',
      options: ['super_admin', 'property_admin', 'staff'],
      required: true
    },
    {
      name: 'propertyIds',
      type: 'relationship',
      relationTo: 'properties',
      hasMany: true,
      required: true
    },
    {
      name: 'status',
      type: 'select',
      options: ['active', 'inactive'],
      defaultValue: 'active',
      required: true
    }
  ]
};
