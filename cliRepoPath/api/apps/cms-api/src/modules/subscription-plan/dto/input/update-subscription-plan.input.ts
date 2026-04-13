import { IsEnum, IsMongoId, IsNotEmpty, IsOptional } from 'class-validator';
import { InputType, Field, PartialType, ID } from '@nestjs/graphql';
import { CreateSubscriptionPlanInput } from './create-subscription-plan.input';
import { SubscriptionPlanStatus } from '@app/data-access/subscription-plan/enum/subscription-plan.enum';

@InputType()
export class UpdateSubscriptionPlanInput extends PartialType(CreateSubscriptionPlanInput) {
  @Field(() => ID)
  @IsNotEmpty()
  @IsMongoId()
  _id: string;

  @Field(() => SubscriptionPlanStatus, { nullable: true })
  @IsOptional()
  @IsEnum(SubscriptionPlanStatus)
  status?: SubscriptionPlanStatus;
}
