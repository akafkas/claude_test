export type TenantId = string;

export interface PropertyRef {
  organizationId: TenantId;
  propertyId: TenantId;
}

export interface BuildInfo {
  workspace: string;
  status: 'ready';
}

export interface ConnectionConfig {
  url: string;
  connectTimeoutMs: number;
}

export interface StorageConfig {
  endpoint: string;
  bucket: string;
  accessKey: string;
  secretKey: string;
  forcePathStyle: boolean;
}

export interface StripeConfig {
  secretKey: string;
  webhookSecret: string;
}

export interface EmailConfig {
  providerApiKey: string;
  from: string;
}

export interface LoggingConfig {
  level: 'debug' | 'info' | 'warn' | 'error';
  serviceName: string;
}

export interface AppEnvironment {
  nodeEnv: 'development' | 'test' | 'production';
  appUrl: string;
  payloadSecret: string;
  database: ConnectionConfig;
  redis: ConnectionConfig;
  storage: StorageConfig;
  stripe: StripeConfig;
  email: EmailConfig;
  logging: LoggingConfig;
}

export interface HealthCheckResult {
  name: string;
  ok: boolean;
  detail: string;
}
