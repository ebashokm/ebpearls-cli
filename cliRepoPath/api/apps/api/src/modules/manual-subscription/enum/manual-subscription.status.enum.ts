import { registerEnumType } from '@nestjs/graphql';

export enum ManualSubscriptionStatus {
  TRIALLING = 'TRIALLING',
  ACTIVE = 'ACTIVE',
  PAUSED = 'PAUSED',
  PAST_DUE = 'PAST_DUE',
  CANCELLED = 'CANCELLED',
  EXPIRED = 'EXPIRED',
}

registerEnumType(ManualSubscriptionStatus, {
  name: 'SubscriptionStatus',
  description: 'The subscription status available in the system',
});
