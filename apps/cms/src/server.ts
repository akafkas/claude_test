import { loadAppEnvironment, type EnvMap } from '@nous/config';

import { createPayloadConfig } from './payload.config.js';

const runtimeEnv = (): EnvMap => {
  const runtime = globalThis as unknown as { process?: { env?: EnvMap } };
  return runtime.process?.env ?? {};
};

export const createCmsServer = async (): Promise<{ port: number; adminLoginUrl: string }> => {
  const env = loadAppEnvironment(runtimeEnv());

  const config = createPayloadConfig({
    databaseURL: env.database.url,
    payloadSecret: env.payloadSecret,
    serverURL: env.appUrl
  });

  const runtime = globalThis as unknown as {
    process?: { env?: Record<string, string | undefined> };
  };
  const port = Number(runtime.process?.env?.PORT ?? '3001');

  return {
    port,
    adminLoginUrl: `${env.appUrl}${config.admin.loginRoute}`
  };
};
