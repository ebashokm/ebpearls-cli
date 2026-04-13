import { registerEnumType } from '@nestjs/graphql';

export enum PaypalTransactionType {
  ONE_TIME_PAYMENT = 'ONE_TIME_PAYMENT',
  SUBSCRIPTION_PAYMENT = 'SUBSCRIPTION_PAYMENT',
  REFUND = 'REFUND',
}

registerEnumType(PaypalTransactionType, {
  name: 'PaypalTransactionType',
  description: 'The type of a PayPal transaction',
});
