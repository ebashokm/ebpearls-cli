import { registerEnumType } from '@nestjs/graphql';
export enum StripeSubscriptionStatus {
  ACTIVE = 'ACTIVE',
  TRIALING = 'TRIALING',
  PENDING = 'PENDING',
  REJECTED = 'REJECTED',
  CANCELED = 'CANCELED',
}
// tweak the status as per the requirements
registerEnumType(StripeSubscriptionStatus, {
  name: 'StripeSubscriptionStatus',
});

export const StripeSubscriptionStatusMap = {
  active: StripeSubscriptionStatus.ACTIVE,
  canceled: StripeSubscriptionStatus.CANCELED,
  unpaid: StripeSubscriptionStatus.REJECTED,
  incomplete: StripeSubscriptionStatus.REJECTED,
  incomplete_expired: StripeSubscriptionStatus.REJECTED,
  past_due: StripeSubscriptionStatus.REJECTED,
};
