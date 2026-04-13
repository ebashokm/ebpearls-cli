import {
  UserSchema,
  User,
  UpdatePhoneNumber,
  UpdatePhoneNumberSchema,
  PaymentMethod,
  PaymentMethodSchema,
  StripeCustomerSchema,
  StripeCustomer,
} from '@app/data-access';
import { StripePayment, StripePaymentSchema } from './model/stripe-payment.schema';
import { StripePaymentLog, StripePaymentLogSchema } from './model/stripe-payment-log.schema';

export const mongooseModels = [
  { name: User.name, schema: UserSchema },
  { name: StripeCustomer.name, schema: StripeCustomerSchema },
  { name: PaymentMethod.name, schema: PaymentMethodSchema },
  { name: StripePayment.name, schema: StripePaymentSchema },
  { name: StripePaymentLog.name, schema: StripePaymentLogSchema },
  { name: UpdatePhoneNumber.name, schema: UpdatePhoneNumberSchema },
];
