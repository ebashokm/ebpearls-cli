import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { StripeSubscriptionService } from './stripe-subscriptions.service';
import { CreateStripeSubscriptionInput } from './dto/input/create-stripe-subscription.input';
import { UpdateStripeSubscriptionInput } from './dto/input/update-stripe-subscription.input';
import { UseGuards } from '@nestjs/common';
import { AuthUserGuard } from '@api/guards/auth.user.guard';
import { StripeSubscriptionResponse } from './dto/response/stripe-subscription.dto';
import { SubscriptionProductResponse } from './dto/response/subscription-product.response';
import { MessageResponse } from '@app/common/dto/response/message.response';
import { LoginDetail } from '@api/modules/auth/decorator/login.decorator';
import { TermsGuard } from '@api/guards/terms.guard';

/**
 * Description placeholder
 *
 * @export
 * @class StripeSubscriptionResolver
 * @typedef {StripeSubscriptionResolver}
 */
@Resolver(() => StripeSubscriptionResponse)
@UseGuards(AuthUserGuard, TermsGuard)
export class StripeSubscriptionResolver {
  /**
   * Creates an instance of StripeSubscriptionResolver.
   *
   * @constructor
   * @param {StripeSubscriptionService} stripeSubscriptionsService
   */
  constructor(private readonly stripeSubscriptionsService: StripeSubscriptionService) {}

  /**
   * Description placeholder
   *
   * @async
   * @returns {unknown}
   */
  @Query(() => [SubscriptionProductResponse], {
    name: 'listAvailableSubscriptions',
  })
  async findAllAvailableSubscriptionProducts() {
    return this.stripeSubscriptionsService.findAllAvailableSubscriptionProducts();
  }

  /**
   * Description placeholder
   *
   * @async
   * @param {*} loginDetail
   * @param {CreateStripeSubscriptionInput} body
   * @returns {unknown}
   */
  @Mutation(() => MessageResponse)
  async createStripeSubscription(
    @LoginDetail() loginDetail,
    @Args('body')
    body: CreateStripeSubscriptionInput,
  ) {
    return this.stripeSubscriptionsService.create(loginDetail.userId, body);
  }

  /**
   * Description placeholder
   *
   * @async
   * @param {*} loginDetail
   * @param {UpdateStripeSubscriptionInput} body
   * @returns {unknown}
   */
  @Mutation(() => MessageResponse)
  async updateStripeSubscription(
    @LoginDetail() loginDetail,
    @Args('body')
    body: UpdateStripeSubscriptionInput,
  ) {
    return this.stripeSubscriptionsService.update(loginDetail.userId, body);
  }

  /**
   * Description placeholder
   *
   * @async
   * @param {*} loginDetail
   * @returns {unknown}
   */
  @Query(() => StripeSubscriptionResponse, {
    name: 'currentStripeSubscription',

    nullable: true,
  })
  async getCurrentSubscription(@LoginDetail() loginDetail) {
    return this.stripeSubscriptionsService.getCurrentSubscription(loginDetail.userId);
  }

  /**
   * Description placeholder
   *
   * @async
   * @param {*} LoginDetail
   * @returns {unknown}
   */
  @Mutation(() => MessageResponse)
  async cancelStripeSubscription(@LoginDetail() LoginDetail) {
    return this.stripeSubscriptionsService.cancelSubscription(LoginDetail.userId);
  }

  /**
   * Description placeholder
   *
   * @async
   * @param {*} LoginDetail
   * @returns {unknown}
   */
  @Mutation(() => MessageResponse)
  async endTrial(@LoginDetail() LoginDetail) {
    return this.stripeSubscriptionsService.endTrial(LoginDetail.userId);
  }
}
