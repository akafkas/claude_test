import type {
  AppEnvironment,
  BuildInfo,
  EmailConfig,
  LoggingConfig,
  StorageConfig,
  StripeConfig
} from '@nous/types';

export const CONFIG_BUILD_INFO: BuildInfo = {
  workspace: '@nous/config',
  status: 'ready'
};

export type EnvMap = Record<string, string | undefined>;

const required = (value: string | undefined, key: string): string => {
  if (!value || value.trim().length === 0) {
    throw new Error(`Missing required env var: ${key}`);
  }

  return value;
};

const optional = (value: string | undefined, fallback: string): string => {
  return value && value.trim().length > 0 ? value : fallback;
};

const parseNodeEnv = (value: string | undefined): AppEnvironment['nodeEnv'] => {
  const env = optional(value, 'development');
  if (env === 'development' || env === 'test' || env === 'production') {
    return env;
  }

  throw new Error(`NODE_ENV must be development|test|production. Received: ${env}`);
};

const parseBoolean = (value: string | undefined, fallback: boolean): boolean => {
  if (value === undefined) {
    return fallback;
  }

  return value === 'true';
};

const parseNumber = (value: string | undefined, fallback: number): number => {
  if (value === undefined || value.trim().length === 0) {
    return fallback;
  }

  const parsed = Number(value);
  if (Number.isNaN(parsed) || parsed <= 0) {
    throw new Error(`Expected positive number but received: ${value}`);
  }

  return parsed;
};

export const loadAppEnvironment = (source: EnvMap): AppEnvironment => {
  const storage: StorageConfig = {
    endpoint: required(source.S3_ENDPOINT, 'S3_ENDPOINT'),
    bucket: required(source.S3_BUCKET, 'S3_BUCKET'),
    accessKey: required(source.S3_ACCESS_KEY, 'S3_ACCESS_KEY'),
    secretKey: required(source.S3_SECRET_KEY, 'S3_SECRET_KEY'),
    forcePathStyle: parseBoolean(source.S3_FORCE_PATH_STYLE, true)
  };

  const stripe: StripeConfig = {
    secretKey: required(source.STRIPE_SECRET_KEY, 'STRIPE_SECRET_KEY'),
    webhookSecret: required(source.STRIPE_WEBHOOK_SECRET, 'STRIPE_WEBHOOK_SECRET')
  };

  const email: EmailConfig = {
    providerApiKey: required(source.EMAIL_PROVIDER_API_KEY, 'EMAIL_PROVIDER_API_KEY'),
    from: required(source.EMAIL_FROM, 'EMAIL_FROM')
  };

  const rawLogLevel = optional(source.LOG_LEVEL, 'info');
  if (!['debug', 'info', 'warn', 'error'].includes(rawLogLevel)) {
    throw new Error(`LOG_LEVEL must be debug|info|warn|error. Received: ${rawLogLevel}`);
  }

  const logging: LoggingConfig = {
    level: rawLogLevel as LoggingConfig['level'],
    serviceName: optional(source.LOG_SERVICE_NAME, 'nous-platform')
  };

  return {
    nodeEnv: parseNodeEnv(source.NODE_ENV),
    appUrl: required(source.NEXT_PUBLIC_APP_URL, 'NEXT_PUBLIC_APP_URL'),
    payloadSecret: required(source.PAYLOAD_SECRET, 'PAYLOAD_SECRET'),
    database: {
      url: required(source.DATABASE_URL, 'DATABASE_URL'),
      connectTimeoutMs: parseNumber(source.DATABASE_CONNECT_TIMEOUT_MS, 3000)
    },
    redis: {
      url: required(source.REDIS_URL, 'REDIS_URL'),
      connectTimeoutMs: parseNumber(source.REDIS_CONNECT_TIMEOUT_MS, 2000)
    },
    storage,
    stripe,
    email,
    logging
  };
};

const parseUrl = (url: string): { protocol: string; host: string; port?: number } => {
  const match = url.match(/^([a-z]+):\/\/([^/:?#]+)(?::(\d+))?/i);
  if (!match) {
    throw new Error(`Invalid connection URL: ${url}`);
  }

  const protocol = match[1];
  const host = match[2];
  const port = match[3];

  if (!protocol || !host) {
    throw new Error(`Invalid connection URL: ${url}`);
  }

  const base = {
    protocol: protocol.toLowerCase(),
    host
  };

  if (port) {
    return { ...base, port: Number(port) };
  }

  return base;
};

export const connectionTargetsFromUrl = (url: string): { host: string; port: number } => {
  const parsed = parseUrl(url);

  if (parsed.port) {
    return { host: parsed.host, port: parsed.port };
  }

  if (parsed.protocol.startsWith('postgres')) {
    return { host: parsed.host, port: 5432 };
  }

  if (parsed.protocol.startsWith('redis')) {
    return { host: parsed.host, port: 6379 };
  }

  return { host: parsed.host, port: 80 };
};
