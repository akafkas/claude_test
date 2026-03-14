import { loadAppEnvironment, type EnvMap } from '@nous/config';
import { createLogger } from '@nous/config/services';
import { runInfrastructureHealthChecks } from '@nous/db';

const runtimeEnv = (): EnvMap => {
  const runtime = globalThis as unknown as { process?: { env?: EnvMap } };
  return runtime.process?.env ?? {};
};

export const workerBootMessage = (): string => {
  const env = loadAppEnvironment(runtimeEnv());
  const logger = createLogger(env);
  logger.info('worker booted', { service: 'worker' });
  return `worker-ready:${env.logging.serviceName}`;
};

export const workerHealthCheck = async (): Promise<{ ok: boolean; checks: unknown[] }> => {
  const env = loadAppEnvironment(runtimeEnv());
  const checks = await runInfrastructureHealthChecks({ database: env.database, redis: env.redis });

  return {
    ok: checks.every((check) => check.ok),
    checks
  };
};
