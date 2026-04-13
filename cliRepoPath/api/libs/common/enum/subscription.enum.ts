import { registerEnumType } from '@nestjs/graphql';

export enum BillingIntervalEnum {
  day = 'day',
  week = 'week',
  month = 'month',
  year = 'year',
}

registerEnumType(BillingIntervalEnum, {
  name: 'BillingIntervalEnum',
});
