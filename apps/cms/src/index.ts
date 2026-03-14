import { loadAppEnvironment, type EnvMap } from '@nous/config';

import { createPayloadConfig } from './payload.config.js';

const runtimeEnv = (): EnvMap => {
  const runtime = globalThis as unknown as { process?: { env?: EnvMap } };
  return runtime.process?.env ?? {};
};

export const cmsBootMessage = (): string => {
  const env = loadAppEnvironment(runtimeEnv());
  const config = createPayloadConfig({
    databaseURL: env.database.url,
    payloadSecret: env.payloadSecret,
    serverURL: env.appUrl
  });

  return `cms-ready:${String(config.admin.user)}`;
};

export { createPayloadConfig };
