import { registerEnumType } from '@nestjs/graphql';

export enum BillingCycle {
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  YEARLY = 'YEARLY',
  QUARTERLY = 'QUARTERLY',
}

registerEnumType(BillingCycle, {
  name: 'BillingCycle',
  description: 'The billing cycles available in the system',
});
