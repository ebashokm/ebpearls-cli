import { registerEnumType } from '@nestjs/graphql';

/**
 * ${1:Description placeholder}
 *
 * @export
 * @enum {number}
 */
export enum BillingCycleEnum {
  MONTHLY,
  QUARTERLY,
  BI_YEARLY,
  YEARLY,
}

registerEnumType(BillingCycleEnum, {
  name: 'BillingCycleEnum',
});
