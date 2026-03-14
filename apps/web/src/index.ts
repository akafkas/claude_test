import { loadAppEnvironment, type EnvMap } from '@nous/config';

const runtimeEnv = (): EnvMap => {
  const runtime = globalThis as unknown as { process?: { env?: EnvMap } };
  return runtime.process?.env ?? {};
};

export const webBootMessage = (): string => {
  const env = loadAppEnvironment(runtimeEnv());
  return `web-ready:${env.appUrl}`;
};

export const webHealthConfig = (): { appUrl: string; nodeEnv: string } => {
  const env = loadAppEnvironment(runtimeEnv());
  return { appUrl: env.appUrl, nodeEnv: env.nodeEnv };
};
