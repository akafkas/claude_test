import test from 'node:test';
import assert from 'node:assert/strict';

import { buildTenantRouteShell, supportedPublicRoutes } from '../apps/web/dist/index.js';

const properties = [
  {
    id: 'prop_1',
    propertySlug: 'azure-villa',
    name: 'Azure Villa',
    domain: 'stay-azure.com',
    subdomain: 'azure',
    status: 'active'
  }
];

test('step f: required public routes are registered', () => {
  assert.deepEqual(supportedPublicRoutes(), [
    '/',
    '/rooms',
    '/rooms/[slug]',
    '/offers',
    '/gallery',
    '/location',
    '/contact',
    '/policies',
    '/booking',
    '/manage-booking'
  ]);
});

test('step f: route shell renders for valid tenant and route', async () => {
  const shell = await buildTenantRouteShell({
    host: 'stay-azure.com',
    pathname: '/offers',
    properties,
    theme: { primaryColor: '#ff9900' }
  });

  assert.ok(shell);
  assert.equal(shell.route, '/offers');
  assert.equal(shell.brandClass, 'brand-azure-villa');
  assert.match(shell.html, /Azure Villa|Offers/);
});

test('step f: dynamic room route is treated as valid route', async () => {
  const shell = await buildTenantRouteShell({
    host: 'azure.nous.local',
    pathname: '/rooms/deluxe-suite',
    properties
  });

  assert.ok(shell);
  assert.equal(shell.route, '/rooms/deluxe-suite');
});
