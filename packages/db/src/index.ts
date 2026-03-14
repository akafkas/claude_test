import type { ConnectionConfig, HealthCheckResult, PropertyRef } from '@nous/types';
import { connectionTargetsFromUrl } from '@nous/config';

export const scopedTableName = (table: string, scope: PropertyRef): string => {
  return `${scope.organizationId}_${scope.propertyId}_${table}`;
};

const validateConnectionConfig = (config: ConnectionConfig): HealthCheckResult => {
  const target = connectionTargetsFromUrl(config.url);

  if (!target.host || target.port <= 0) {
    return { name: 'connection', ok: false, detail: `invalid target: ${config.url}` };
  }

  return {
    name: 'connection',
    ok: true,
    detail: `${target.host}:${target.port} (timeout=${config.connectTimeoutMs}ms)`
  };
};

export const checkPostgresConnection = async (
  config: ConnectionConfig
): Promise<HealthCheckResult> => {
  const result = validateConnectionConfig(config);
  return { ...result, name: 'postgres' };
};

export const checkRedisConnection = async (
  config: ConnectionConfig
): Promise<HealthCheckResult> => {
  const result = validateConnectionConfig(config);
  return { ...result, name: 'redis' };
};

export const runInfrastructureHealthChecks = async (args: {
  database: ConnectionConfig;
  redis: ConnectionConfig;
}): Promise<HealthCheckResult[]> => {
  return Promise.all([checkPostgresConnection(args.database), checkRedisConnection(args.redis)]);
};
