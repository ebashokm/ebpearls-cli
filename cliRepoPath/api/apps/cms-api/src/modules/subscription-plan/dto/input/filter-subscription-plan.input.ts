import { Field, InputType } from '@nestjs/graphql';
import { IsBoolean, IsEnum, IsOptional } from 'class-validator';
import { SubscriptionPlanStatus } from '@app/data-access/subscription-plan/enum/subscription-plan.enum';
import { BillingCycle } from '@app/common/enum/billing-cycle.enum';

@InputType()
export class PlanFilterInput {
  @Field(() => SubscriptionPlanStatus, { nullable: true })
  @IsOptional()
  @IsEnum(SubscriptionPlanStatus)
  status?: SubscriptionPlanStatus;

  @Field(() => BillingCycle, { nullable: true })
  @IsOptional()
  @IsEnum(BillingCycle)
  interval?: BillingCycle;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  isPopular?: boolean;
}
