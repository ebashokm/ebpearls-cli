import { registerEnumType } from '@nestjs/graphql';

/**
 * ${1:Description placeholder}
 *
 * @export
 * @enum {number}
 */
export enum SubscriptionStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELED = 'canceled',
  EXPIRED = 'expired',
}

registerEnumType(SubscriptionStatus, {
  name: 'SubscriptionStatus',
});
