import test from 'node:test';
import assert from 'node:assert/strict';

import { createPayloadConfig } from '../apps/cms/dist/payload.config.js';
import { createCmsServer } from '../apps/cms/dist/server.js';

const baseEnv = {
  NODE_ENV: 'test',
  NEXT_PUBLIC_APP_URL: 'http://localhost:3001',
  PAYLOAD_SECRET: 'test-secret',
  DATABASE_URL: 'postgres://postgres:postgres@localhost:5432/nous',
  REDIS_URL: 'redis://localhost:6379',
  S3_ENDPOINT: 'http://localhost:9000',
  S3_BUCKET: 'nous-media',
  S3_ACCESS_KEY: 'key',
  S3_SECRET_KEY: 'secret',
  STRIPE_SECRET_KEY: 'sk_test',
  STRIPE_WEBHOOK_SECRET: 'whsec_test',
  EMAIL_PROVIDER_API_KEY: 'mail-key',
  EMAIL_FROM: 'hello@nous.test'
};

test('payload base config can be created for startup', () => {
  const config = createPayloadConfig({
    databaseURL: 'postgres://postgres:postgres@localhost:5432/nous',
    payloadSecret: 'test-secret',
    serverURL: 'http://localhost:3001'
  });

  assert.equal(config.admin.user, 'users');
  assert.equal(config.admin.loginRoute, '/admin/login');
  assert.ok(Array.isArray(config.collections));
  assert.equal(config.collections[0]?.slug, 'users');
  assert.equal(config.collections[0]?.auth, true);
});

test('cms startup exposes admin login URL metadata', async () => {
  process.env = { ...process.env, ...baseEnv, PORT: '3100' };

  const startup = await createCmsServer();

  assert.equal(startup.port, 3100);
  assert.equal(startup.adminLoginUrl, 'http://localhost:3001/admin/login');
});
