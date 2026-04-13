import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { SubscriptionService } from './subscription.service';
import { Subscription } from '@app/data-access';
import { UseGuards } from '@nestjs/common';
import { AuthUserGuard } from '../../guards/auth.user.guard';
import { LoginDetail } from '../auth/decorator/login.decorator';
import { LoginDetailType } from '../auth/types/login-detail.type';
import { AndroidReceipt, IosReceipt } from './dto/input/validate-receipt.input';
import { TermsGuard } from '@api/guards/terms.guard';
import { OfferSignatureResponse } from './dto/response/signature.response';

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class SubscriptionResolver
 * @typedef {SubscriptionResolver}
 */
@Resolver(() => Subscription)
@UseGuards(AuthUserGuard, TermsGuard)
export class SubscriptionResolver {
  /**
   * Creates an instance of SubscriptionResolver.
   *
   * @constructor
   * @param {SubscriptionService} subscriptionService
   */
  constructor(private readonly subscriptionService: SubscriptionService) {}

  /**
   * ${1:Description placeholder}
   *
   * @param {LoginDetailType} loginDetail
   * @param {IosReceipt} receiptData
   * @returns {*}
   */
  @Mutation(() => Boolean)
  verifyIosSubscription(
    @LoginDetail() loginDetail: LoginDetailType,
    @Args('receiptData') receiptData: IosReceipt,
  ) {
    return this.subscriptionService.verifyIosSubscription(loginDetail, receiptData);
  }

  /**
   * ${1:Description placeholder}
   *
   * @param {LoginDetailType} loginDetail
   * @param {AndroidReceipt} body
   * @returns {*}
   */
  @Mutation(() => Boolean)
  verifyAndroidSubscription(
    @LoginDetail() loginDetail: LoginDetailType,
    @Args('body') body: AndroidReceipt,
  ) {
    return this.subscriptionService.verifyAndroidSubscription(loginDetail, body);
  }

  @Mutation(() => OfferSignatureResponse)
  async createOfferSignature(
    @Args('appBundleId') appBundleId: string,
    @Args('applicationUsernameHash') applicationUsernameHash: string,
    @Args('productIdentifier') productIdentifier: string,
    @Args('offerIdentifier') offerIdentifier: string,
  ): Promise<OfferSignatureResponse> {
    return await this.subscriptionService.createOfferSignature(
      appBundleId,
      applicationUsernameHash,
      productIdentifier,
      offerIdentifier,
    );
  }
}
