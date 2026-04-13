import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { SubscriptionPlanService } from './subscription-plan.service';
import { CreateSubscriptionPlanInput } from './dto/input/create-subscription-plan.input';
import { UpdateSubscriptionPlanInput } from './dto/input/update-subscription-plan.input';
import {
  PaginatedSubscriptionPlanResponse,
  SubscriptionPlanResponse,
} from './dto/response/subscription-plan.response';
import { Permissions } from '../auth/decorator/permissions.decorator';
import { DeleteSubscriptionPlanInput } from './dto/input/delete-subscription-plan.input';
import { MessageResponse } from '@app/common/dto/response/message.response';
import { BasePaginationParams } from '@cms-api/common/dto/base-pagination.dto';

@Resolver(() => SubscriptionPlanResponse)
export class SubscriptionPlanResolver {
  constructor(private readonly subscriptionPlanService: SubscriptionPlanService) {}

  @Mutation(() => SubscriptionPlanResponse)
  @Permissions('create-subscription-plan')
  createSubscriptionPlan(@Args('input') input: CreateSubscriptionPlanInput) {
    return this.subscriptionPlanService.create(input);
  }

  @Mutation(() => SubscriptionPlanResponse)
  @Permissions('update-subscription-plan')
  updateSubscriptionPlan(@Args('input') input: UpdateSubscriptionPlanInput) {
    return this.subscriptionPlanService.update(input);
  }

  @Query(() => SubscriptionPlanResponse, { nullable: true })
  @Permissions('update-subscription-plan')
  getSubscriptionPlanBySlug(@Args('slug') slug: string) {
    return this.subscriptionPlanService.findBySlug(slug);
  }

  @Query(() => PaginatedSubscriptionPlanResponse, { nullable: true })
  @Permissions('list-subscription-plan')
  getAllSubscriptionPlans(@Args('input') input: BasePaginationParams) {
    return this.subscriptionPlanService.findAll(input);
  }

  @Mutation(() => MessageResponse)
  @Permissions('delete-subscription-plan')
  deleteSubscriptionPlan(@Args('input') input: DeleteSubscriptionPlanInput) {
    return this.subscriptionPlanService.delete(input);
  }
}
