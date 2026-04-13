import { BaseEntityResponse } from '@app/common/dto/response/base-entity.response';
import { BillingCycle } from '@app/common/enum/billing-cycle.enum';
import { PaymentProvider } from '@app/common/enum/payment-provider.enum';
import { Field, ObjectType } from '@nestjs/graphql';
import { ManualSubscriptionStatus } from '../../enum/manual-subscription.status.enum';

@ObjectType()
export class CreateManualSubscriptionResponse {
  @Field()
  success: boolean;

  @Field()
  message: string;

  @Field({ nullable: true })
  orderId?: string;

  @Field({ nullable: true })
  approvalUrl?: string;

  @Field({ nullable: true })
  clientSecret?: string;

  @Field({ nullable: true })
  requiresAction?: boolean;

  @Field({ nullable: true })
  paymentIntentId?: string;
}

@ObjectType()
export class ManualSubscriptionResponse extends BaseEntityResponse {
  @Field()
  userId: string;

  @Field(() => PaymentProvider)
  paymentProvider: PaymentProvider;

  @Field()
  planId: string;

  @Field()
  planName: string;

  @Field()
  amount: number;

  @Field()
  currency: string;

  @Field(() => BillingCycle)
  billingCycle: BillingCycle;

  @Field(() => ManualSubscriptionStatus)
  status: ManualSubscriptionStatus;

  @Field({ nullable: true })
  providerCustomerId?: string;

  @Field({ nullable: true })
  currentPeriodStart?: Date;

  @Field({ nullable: true })
  currentPeriodEnd?: Date;

  @Field({ nullable: true })
  cancelAtPeriodEnd?: boolean;

  @Field({ nullable: true })
  pausedAt?: Date;

  @Field({ nullable: true })
  resumeAt?: Date;

  @Field({ nullable: true })
  cancelledAt?: Date;

  @Field({ nullable: true })
  lastPaymentDate?: Date;

  @Field({ nullable: true })
  nextPaymentDate?: Date;
}
