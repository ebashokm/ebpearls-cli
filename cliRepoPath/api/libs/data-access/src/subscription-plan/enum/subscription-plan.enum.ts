import { registerEnumType } from '@nestjs/graphql';

export enum SubscriptionPlanStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  ARCHIVED = 'ARCHIVED',
}

registerEnumType(SubscriptionPlanStatus, {
  name: 'SubscriptionPlanStatus',
  description: 'The status of the subscription plan',
});
