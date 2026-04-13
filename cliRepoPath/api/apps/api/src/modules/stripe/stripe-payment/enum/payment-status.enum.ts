import { registerEnumType } from '@nestjs/graphql';

/**
 * ${1:Description placeholder}
 *
 * @export
 * @enum {number}
 */
export enum PaymentStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

registerEnumType(PaymentStatus, {
  name: 'PaymentStatus',
});

export enum BusinessType {
  company = 'company',
  governmentEntity = 'government_entity',
  individual = 'individual',
  nonProfit = 'non_profit',
}

registerEnumType(BusinessType, {
  name: 'BusinessType',
});
