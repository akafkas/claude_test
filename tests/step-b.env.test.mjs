import test from 'node:test';
import assert from 'node:assert/strict';

import { loadAppEnvironment } from '../packages/config/dist/index.js';

const baseEnv = {
  NODE_ENV: 'test',
  NEXT_PUBLIC_APP_URL: 'http://localhost:3000',
  PAYLOAD_SECRET: 'test-secret',
  DATABASE_URL: 'postgres://postgres:postgres@127.0.0.1:5432/nous',
  REDIS_URL: 'redis://127.0.0.1:6379',
  S3_ENDPOINT: 'http://127.0.0.1:9000',
  S3_BUCKET: 'nous-media',
  S3_ACCESS_KEY: 'key',
  S3_SECRET_KEY: 'secret',
  STRIPE_SECRET_KEY: 'sk_test_123',
  STRIPE_WEBHOOK_SECRET: 'whsec_123',
  EMAIL_PROVIDER_API_KEY: 'email-key',
  EMAIL_FROM: 'hello@nous.test',
  LOG_LEVEL: 'info',
  LOG_SERVICE_NAME: 'nous-test'
};

test('loadAppEnvironment returns a strongly-typed infra config', () => {
  const env = loadAppEnvironment(baseEnv);

  assert.equal(env.nodeEnv, 'test');
  assert.equal(env.database.connectTimeoutMs, 3000);
  assert.equal(env.redis.connectTimeoutMs, 2000);
  assert.equal(env.storage.forcePathStyle, true);
  assert.equal(env.logging.serviceName, 'nous-test');
});

test('loadAppEnvironment throws when required vars are missing', () => {
  const broken = { ...baseEnv };
  delete broken.DATABASE_URL;

  assert.throws(() => loadAppEnvironment(broken), /DATABASE_URL/);
});
