import test from 'node:test';
import assert from 'node:assert/strict';

import { resolveTenantSite } from '../apps/web/dist/index.js';

const properties = [
  {
    id: 'prop_1',
    propertySlug: 'azure-villa',
    name: 'Azure Villa',
    domain: 'stay-azure.com',
    subdomain: 'azure',
    status: 'active'
  },
  {
    id: 'prop_2',
    propertySlug: 'hidden-hotel',
    name: 'Hidden Hotel',
    domain: 'hidden-hotel.com',
    subdomain: 'hidden',
    status: 'inactive'
  }
];

test('step f: resolves active tenant by custom domain', () => {
  const resolved = resolveTenantSite({ host: 'stay-azure.com:443', properties });
  assert.equal(resolved?.propertySlug, 'azure-villa');
});

test('step f: resolves active tenant by nous subdomain', () => {
  const resolved = resolveTenantSite({ host: 'azure.nous.local', properties });
  assert.equal(resolved?.id, 'prop_1');
});

test('step f: inactive properties are not resolved', () => {
  const resolved = resolveTenantSite({ host: 'hidden-hotel.com', properties });
  assert.equal(resolved, undefined);
});
