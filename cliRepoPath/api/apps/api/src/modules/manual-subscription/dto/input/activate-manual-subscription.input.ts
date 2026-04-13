import { BillingCycle } from '@app/common/enum/billing-cycle.enum';
import { PaymentProvider } from '@app/common/enum/payment-provider.enum';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class ActivateManualSubscriptionInput {
  @Field(() => String)
  userId: string;

  @Field(() => String)
  planId: string;

  @Field(() => PaymentProvider)
  paymentProvider: PaymentProvider;

  @Field(() => BillingCycle)
  billingCycle: BillingCycle;

  @Field(() => String)
  providerPaymentId: string;

  @Field(() => String, { nullable: true })
  providerCustomerId?: string;

  @Field(() => Number)
  amount: number;
}
