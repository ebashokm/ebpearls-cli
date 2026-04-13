import { BaseEntityResponse } from '@app/common/dto/response/base-entity.response';
import { BaseResponse } from '@app/common/dto/response/base-response.dto';
import { SubscriptionPlanStatus } from '@app/data-access/subscription-plan/enum/subscription-plan.enum';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class SubscriptionPlanResponse extends BaseEntityResponse {
  @Field()
  name: string;

  @Field()
  slug: string;

  @Field({ nullable: true })
  description: string;

  @Field()
  amount: number;

  @Field()
  currency: string;

  @Field({ nullable: true })
  interval: string;

  @Field({ nullable: true })
  trialDays: number;

  @Field(() => SubscriptionPlanStatus, { nullable: true })
  status: SubscriptionPlanStatus;

  @Field(() => [String], { nullable: true })
  features: string[];

  @Field({ nullable: true })
  isPopular: boolean;

  @Field({ nullable: true })
  sortOrder: number;
}

@ObjectType()
export class PaginatedSubscriptionPlanResponse extends BaseResponse {
  @Field(() => [SubscriptionPlanResponse], { nullable: true })
  data: SubscriptionPlanResponse[];
}
