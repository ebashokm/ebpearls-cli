import { registerEnumType } from '@nestjs/graphql';

export enum PaypalSubscriptionStatus {
  ACTIVE = 'ACTIVE',
  CANCELLED = 'CANCELLED',
  EXPIRED = 'EXPIRED',
  SUSPENDED = 'SUSPENDED',
}

registerEnumType(PaypalSubscriptionStatus, {
  name: 'PaypalSubscriptionStatus',
});
