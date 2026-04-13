import { BillingCycle } from '@app/common/enum/billing-cycle.enum';
import { PaymentProvider } from '@app/common/enum/payment-provider.enum';
import { InputType, Int, Field } from '@nestjs/graphql';
import { IsEnum, IsMongoId, IsNotEmpty, IsOptional } from 'class-validator';

@InputType()
export class CreateManualSubscriptionInput {
  @Field()
  @IsNotEmpty()
  @IsMongoId()
  planId: string;

  @Field(() => PaymentProvider)
  @IsEnum(PaymentProvider)
  @IsNotEmpty()
  paymentProvider: PaymentProvider;

  @Field(() => BillingCycle)
  @IsEnum(BillingCycle)
  @IsNotEmpty()
  billingCycle: BillingCycle;

  @Field({ nullable: true })
  @IsOptional()
  paymentMethodId?: string;
}
