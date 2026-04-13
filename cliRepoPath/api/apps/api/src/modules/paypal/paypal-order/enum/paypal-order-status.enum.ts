import { registerEnumType } from '@nestjs/graphql';

export enum PaypalOrderStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  CREATED = 'CREATED',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
  CANCELLED = 'CANCELLED',
}

registerEnumType(PaypalOrderStatus, {
  name: 'PaypalOrderStatus',
  description: 'The status of a PayPal order',
});
