import test from 'node:test';
import assert from 'node:assert/strict';

import { createPayloadConfig } from '../apps/cms/dist/payload.config.js';

const findCollection = (config, slug) => config.collections.find((collection) => collection.slug === slug);
const fieldNames = (collection) => collection.fields.map((field) => field.name);

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

test('step e: payload config includes cms and branding collections', () => {
  const config = createPayloadConfig({
    databaseURL: 'postgres://postgres:postgres@localhost:5432/nous',
    payloadSecret: 'test-secret',
    serverURL: 'http://localhost:3001'
  });

  const slugs = config.collections.map((collection) => collection.slug);
  assert.ok(slugs.includes('pages'));
  assert.ok(slugs.includes('offers'));
  assert.ok(slugs.includes('media'));
  assert.ok(slugs.includes('siteSettings'));
});

test('step e: pages and offers have required field minimums', () => {
  const config = createPayloadConfig({
    databaseURL: 'postgres://postgres:postgres@localhost:5432/nous',
    payloadSecret: 'test-secret',
    serverURL: 'http://localhost:3001'
  });

  const pages = findCollection(config, 'pages');
  const offers = findCollection(config, 'offers');

  assert.deepEqual(fieldNames(pages), ['property', 'title', 'slug', 'status', 'seo', 'blocks', 'locale']);
  assert.deepEqual(fieldNames(offers), [
    'property',
    'title',
    'slug',
    'summary',
    'content',
    'status',
    'startsAt',
    'endsAt'
  ]);
});

test('step e: siteSettings supports branding fields per property', () => {
  const config = createPayloadConfig({
    databaseURL: 'postgres://postgres:postgres@localhost:5432/nous',
    payloadSecret: 'test-secret',
    serverURL: 'http://localhost:3001'
  });

  const siteSettings = findCollection(config, 'siteSettings');

  assert.deepEqual(fieldNames(siteSettings), [
    'property',
    'logo',
    'favicon',
    'primaryColor',
    'secondaryColor',
    'fonts',
    'navLinks',
    'footerContent',
    'socialLinks',
    'seoDefaults',
    'analyticsIds'
  ]);

  assert.deepEqual(siteSettings.access.read({ req: propertyAdminReq }), {
    where: {
      property: {
        in: ['prop_1', 'prop_2']
      }
    }
  });
});
