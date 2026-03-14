import test from 'node:test';
import assert from 'node:assert/strict';

import {
  membershipScope,
  organizationScope,
  propertyScope,
  selfUserScope
} from '../apps/cms/dist/auth/tenant-access.js';

test('step d: no memberships means no cross-tenant org/property access', () => {
  const req = {
    user: {
      id: 'u10',
      isSuperAdmin: false,
      memberships: []
    }
  };

  assert.equal(organizationScope(req), false);
  assert.equal(propertyScope(req), false);
});

test('step d: inactive memberships do not grant scope', () => {
  const req = {
    user: {
      id: 'u11',
      isSuperAdmin: false,
      memberships: [
        {
          organizationId: 'org_hidden',
          role: 'property_admin',
          propertyIds: ['prop_hidden'],
          status: 'inactive'
        }
      ]
    }
  };

  assert.equal(organizationScope(req), false);
  assert.equal(propertyScope(req), false);
});

test('step d: membership scope is restricted to authenticated user', () => {
  const req = {
    user: {
      id: 'u12',
      isSuperAdmin: false,
      memberships: [
        {
          organizationId: 'org_2',
          role: 'staff',
          propertyIds: ['prop_9'],
          status: 'active'
        }
      ]
    }
  };

  assert.deepEqual(membershipScope(req), {
    where: {
      user: {
        equals: 'u12'
      }
    }
  });

  assert.deepEqual(selfUserScope(req), {
    where: {
      id: {
        equals: 'u12'
      }
    }
  });
});
