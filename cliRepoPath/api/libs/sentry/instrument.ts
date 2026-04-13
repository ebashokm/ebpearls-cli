import * as Sentry from '@sentry/nestjs';

export const initSentry = (overrides?: Partial<Sentry.NodeOptions>) =>
  Sentry.init({
    dsn: process.env.SENTRY_DSN,

    // Setting this option to true will send default PII data to Sentry.
    // For example, automatic IP address collection on events
    sendDefaultPii: true,
    enableLogs: true,
    integrations: [
      Sentry.consoleLoggingIntegration({ levels: ['log', 'warn', 'error'] }),
      Sentry.graphqlIntegration(),
    ],
    ...overrides,
  });
