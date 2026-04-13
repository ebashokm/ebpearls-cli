import { registerEnumType } from '@nestjs/graphql';
export enum ContactStatus {
  ACTIVE = 'ACTIVE',
  PENDING = 'PENDING',
  CANCELED = 'CANCELED',
}
// tweak the status as per the requirements
registerEnumType(ContactStatus, {
  name: 'StripeSubscriptionStatus',
});
