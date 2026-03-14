import type { AppEnvironment, HealthCheckResult } from '@nous/types';

export interface ObjectStorageClient {
  putObject(input: { key: string; body: string | Uint8Array; contentType?: string }): Promise<void>;
}

export interface PaymentGateway {
  createPaymentIntent(input: {
    amount: number;
    currency: string;
    metadata?: Record<string, string>;
  }): Promise<{ id: string; clientSecret: string }>;
}

export interface EmailProvider {
  send(input: { to: string; subject: string; html: string }): Promise<{ id: string }>;
}

export interface Logger {
  debug(message: string, context?: Record<string, unknown>): void;
  info(message: string, context?: Record<string, unknown>): void;
  warn(message: string, context?: Record<string, unknown>): void;
  error(message: string, context?: Record<string, unknown>): void;
}

export const createObjectStorageClient = (env: AppEnvironment): ObjectStorageClient => {
  return {
    async putObject(): Promise<void> {
      void env.storage;
    }
  };
};

export const createStripeGateway = (env: AppEnvironment): PaymentGateway => {
  return {
    async createPaymentIntent(input): Promise<{ id: string; clientSecret: string }> {
      const safeAmount = Math.max(0, Math.round(input.amount));
      return {
        id: `pi_${safeAmount}_${env.stripe.secretKey.slice(0, 6)}`,
        clientSecret: `cs_${safeAmount}_${input.currency}`
      };
    }
  };
};

export const createEmailProvider = (env: AppEnvironment): EmailProvider => {
  return {
    async send(input): Promise<{ id: string }> {
      return { id: `${env.email.from}:${input.to}:${Date.now()}` };
    }
  };
};

const writeLog = (
  level: string,
  serviceName: string,
  message: string,
  context: Record<string, unknown> = {}
): void => {
  const payload = JSON.stringify({
    level,
    serviceName,
    message,
    context,
    ts: new Date().toISOString()
  });
  console.log(payload);
};

export const createLogger = (env: AppEnvironment): Logger => {
  return {
    debug(message, context) {
      if (env.logging.level === 'debug') {
        writeLog('debug', env.logging.serviceName, message, context);
      }
    },
    info(message, context) {
      writeLog('info', env.logging.serviceName, message, context);
    },
    warn(message, context) {
      writeLog('warn', env.logging.serviceName, message, context);
    },
    error(message, context) {
      writeLog('error', env.logging.serviceName, message, context);
    }
  };
};

export const summarizeHealth = (
  checks: HealthCheckResult[]
): {
  ok: boolean;
  checks: HealthCheckResult[];
} => {
  return {
    ok: checks.every((check) => check.ok),
    checks
  };
};
