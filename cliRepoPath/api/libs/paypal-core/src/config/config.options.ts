import { Environment } from '@paypal/paypal-server-sdk';

export interface ConfigOptions {
  oAuthClientId: string;
  oAuthClientSecret: string;
  partnerAttributionId: string;
  merchantId: string;
  environment: Environment;
}
