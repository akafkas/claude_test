import test from 'node:test';
import assert from 'node:assert/strict';

import { createPayloadConfig } from '../apps/cms/dist/payload.config.js';

const findCollection = (config, slug) => config.collections.find((collection) => collection.slug === slug);

const superAdminReq = {
  user: {
    id: 'u1',
    isSuperAdmin: true,
    memberships: []
  }
};

const propertyAdminReq = {
  user: {
    id: 'u2',
    isSuperAdmin: false,
    memberships: [
      {
        organizationId: 'org_1',
        role: 'property_admin',
        propertyIds: ['prop_1', 'prop_2'],
        status: 'active'
      }
    ]
  }
};

const staffReq = {
  user: {
    id: 'u3',
    isSuperAdmin: false,
    memberships: [
      {
        organizationId: 'org_1',
        role: 'staff',
        propertyIds: ['prop_2'],
        status: 'active'
      }
    ]
  }
};

test('step d: payload config includes multi-tenant collections', () => {
  const config = createPayloadConfig({
    databaseURL: 'postgres://postgres:postgres@localhost:5432/nous',
    payloadSecret: 'test-secret',
    serverURL: 'http://localhost:3001'
  });

  const slugs = config.collections.map((collection) => collection.slug);
  assert.ok(slugs.includes('users'));
  assert.ok(slugs.includes('organizations'));
  assert.ok(slugs.includes('memberships'));
  assert.ok(slugs.includes('properties'));
});

test('step d: super admin has unrestricted scope', () => {
  const config = createPayloadConfig({
    databaseURL: 'postgres://postgres:postgres@localhost:5432/nous',
    payloadSecret: 'test-secret',
    serverURL: 'http://localhost:3001'
  });

  const organizations = findCollection(config, 'organizations');
  const properties = findCollection(config, 'properties');
  const memberships = findCollection(config, 'memberships');

  assert.equal(organizations.access.read({ req: superAdminReq }), true);
  assert.equal(properties.access.read({ req: superAdminReq }), true);
  assert.equal(memberships.access.read({ req: superAdminReq }), true);
  assert.equal(memberships.access.delete({ req: superAdminReq }), true);
});

test('step d: property admin create/update rights but scoped reads', () => {
  const config = createPayloadConfig({
    databaseURL: 'postgres://postgres:postgres@localhost:5432/nous',
    payloadSecret: 'test-secret',
    serverURL: 'http://localhost:3001'
  });

  const organizations = findCollection(config, 'organizations');
  const properties = findCollection(config, 'properties');

  assert.equal(organizations.access.create({ req: propertyAdminReq }), true);
  assert.deepEqual(organizations.access.read({ req: propertyAdminReq }), {
    where: { id: { in: ['org_1'] } }
  });

  assert.equal(properties.access.create({ req: propertyAdminReq }), true);
  assert.deepEqual(properties.access.read({ req: propertyAdminReq }), {
    where: { id: { in: ['prop_1', 'prop_2'] } }
  });
});

test('step d: staff cannot create organizations or memberships', () => {
  const config = createPayloadConfig({
    databaseURL: 'postgres://postgres:postgres@localhost:5432/nous',
    payloadSecret: 'test-secret',
    serverURL: 'http://localhost:3001'
  });

  const organizations = findCollection(config, 'organizations');
  const memberships = findCollection(config, 'memberships');
  const properties = findCollection(config, 'properties');

  assert.equal(organizations.access.create({ req: staffReq }), false);
  assert.equal(memberships.access.create({ req: staffReq }), false);
  assert.deepEqual(properties.access.read({ req: staffReq }), {
    where: { id: { in: ['prop_2'] } }
  });
});
