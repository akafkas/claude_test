import test from 'node:test';
import assert from 'node:assert/strict';

import {
  checkPostgresConnection,
  checkRedisConnection,
  runInfrastructureHealthChecks
} from '../packages/db/dist/index.js';

test('postgres and redis smoke checks validate connection targets', async () => {
  const pgResult = await checkPostgresConnection({
    url: 'postgres://127.0.0.1:55432/db',
    connectTimeoutMs: 500
  });
  const redisResult = await checkRedisConnection({
    url: 'redis://127.0.0.1:56379',
    connectTimeoutMs: 500
  });

  assert.equal(pgResult.ok, true);
  assert.match(pgResult.detail, /127.0.0.1:55432/);
  assert.equal(redisResult.ok, true);
  assert.match(redisResult.detail, /127.0.0.1:56379/);

  const health = await runInfrastructureHealthChecks({
    database: { url: 'postgres://127.0.0.1:55432/db', connectTimeoutMs: 500 },
    redis: { url: 'redis://127.0.0.1:56379', connectTimeoutMs: 500 }
  });

  assert.equal(
    health.every((item) => item.ok),
    true
  );
});
