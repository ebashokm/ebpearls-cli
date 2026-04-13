import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateStripeSubscriptionInput } from './dto/input/create-stripe-subscription.input';
import { UpdateStripeSubscriptionInput } from './dto/input/update-stripe-subscription.input';
import {
  StripeSubscriptionRepository,
  StripeCustomerRepository,
  UsersRepository,
  SubscriptionProductRepository,
  StripeSubscriptionDocument,
} from '@app/data-access';
import { StripeService } from '@app/stripe';
import { MessageResponse } from '@app/common/dto/response/message.response';
import { SubscriptionProductResponse } from './dto/response/subscription-product.response';
import { StripeSubscriptionResponse } from './dto/response/stripe-subscription.dto';
import { STRIPE_CURRENCY } from '@api/constants';
import {
  StripeSubscriptionStatus,
  StripeSubscriptionStatusMap,
} from '@app/common/enum/stripe-subscription.enum';
import { I18nService } from 'nestjs-i18n';
import { REJECT_STATUS, STRIPE_CUSTOMER_PREFIX, SUBSCRIPTION_STATUS } from './constants';
import Stripe from 'stripe';

/**
 * Description placeholder
 *
 * @export
 * @class StripeSubscriptionService
 * @typedef {StripeSubscriptionService}
 */
@Injectable()
export class StripeSubscriptionService {
  /**
   * Creates an instance of StripeSubscriptionService.
   *
   * @constructor
   * @param {UsersRepository} usersRepository
   * @param {SubscriptionProductRepository} subscriptionProductRepo
   * @param {StripeSubscriptionRepository} stripeSubscriptionRepo
   * @param {StripeService} stripeService
   * @param {StripeCustomerRepository} stripeCustomerRepo
   * @param {I18nService} i18nService
   */
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly subscriptionProductRepo: SubscriptionProductRepository,
    private readonly stripeSubscriptionRepo: StripeSubscriptionRepository,
    private readonly stripeService: StripeService,
    private readonly stripeCustomerRepo: StripeCustomerRepository,
    private readonly i18nService: I18nService,
  ) {}

  /**
   * @description finds all available Stripe subscription products
   */
  async findAllAvailableSubscriptionProducts(): Promise<SubscriptionProductResponse[]> {
    try {
      const products = await this.subscriptionProductRepo.find({
        isActive: true,
      });
      for (const product of products) {
        const activePrices = [];
        product?.prices?.forEach((price) => {
          if (price.isActive && price.currency === STRIPE_CURRENCY) {
            activePrices.push(price);
          }
        });
        product.prices = activePrices;
      }
      return products;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async create(
    userId: string,
    createData: CreateStripeSubscriptionInput,
  ): Promise<MessageResponse> {
    const { productId, priceId, cardId, couponCode } = createData;
    try {
      const existingSubscription = await this.validateExistingSubscription(userId, priceId);
      const stripeCustomer = await this.getOrCreateStripeCustomer(userId);

      await this.setupPaymentMethod(stripeCustomer.customerId, cardId);

      const stripeSubscription = await this.createStripeSubscription(
        stripeCustomer.customerId,
        priceId,
        couponCode,
        existingSubscription?.status === StripeSubscriptionStatus.CANCELED,
      );

      const subscriptionStatus = this.mapSubscriptionStatus(stripeSubscription?.status);
      const isRenewing = existingSubscription?.status === StripeSubscriptionStatus.CANCELED;

      await this.storeSubscription(
        userId,
        productId,
        priceId,
        subscriptionStatus,
        stripeSubscription,
        existingSubscription,
      );

      await this.updateSubscriptionEndDate(
        userId,
        subscriptionStatus,
        isRenewing,
        stripeSubscription,
        existingSubscription,
      );

      return { message: this.i18nService.t('stripe_subscriptions.create_successfully') };
    } catch (error: any) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * Validates whether the user already has an active or rejected subscription.
   */
  private async validateExistingSubscription(userId: string, priceId: string) {
    const subscription = await this.stripeSubscriptionRepo.findOne({ userId });
    if (
      subscription?.status !== StripeSubscriptionStatus.CANCELED &&
      subscription?.status !== StripeSubscriptionStatus.REJECTED &&
      subscription?.priceId === priceId
    ) {
      throw new BadRequestException(this.i18nService.t('stripe_subscriptions.already_subscribed'));
    }
    return subscription;
  }

  /**
   * Retrieves or creates a Stripe customer for the given user.
   */
  private async getOrCreateStripeCustomer(userId: string) {
    let stripeCustomer = await this.stripeCustomerRepo.findOne({ userId });

    if (!stripeCustomer?.customerId) {
      const customer = await this.stripeService.createCustomer({
        description: `${STRIPE_CUSTOMER_PREFIX}-${userId}`,
      });
      stripeCustomer = await this.stripeCustomerRepo.create({
        userId,
        customerId: customer.id,
      });
    }

    return stripeCustomer;
  }

  /**
   * Attaches a payment method and sets it as the default.
   */
  private async setupPaymentMethod(customerId: string, cardId: string) {
    await this.stripeService.attachPaymentMethod(customerId, cardId);
    await this.stripeService.makeSourceDefaultOnStripe(customerId, cardId);
  }

  /**
   * Creates a new subscription on Stripe.
   */
  private async createStripeSubscription(
    customerId: string,
    priceId: string,
    couponCode?: string,
    isRenewal = false,
  ) {
    const subscription = await this.stripeService.createSubscription(
      customerId,
      priceId,
      couponCode,
      isRenewal,
    );
    if (!subscription) {
      throw new BadRequestException(this.i18nService.t('stripe_subscriptions.create_error'));
    }
    return subscription;
  }

  /**
   * Maps Stripe subscription status to internal statuses.
   */
  private mapSubscriptionStatus(stripeStatus: string): StripeSubscriptionStatus {
    if (stripeStatus === SUBSCRIPTION_STATUS.ACTIVE) return StripeSubscriptionStatus.ACTIVE;
    if (stripeStatus === SUBSCRIPTION_STATUS.TRIALING) return StripeSubscriptionStatus.TRIALING;
    if (stripeStatus === SUBSCRIPTION_STATUS.CANCELED) return StripeSubscriptionStatus.CANCELED;
    if (REJECT_STATUS.includes(stripeStatus)) return StripeSubscriptionStatus.REJECTED;
    return StripeSubscriptionStatus.PENDING;
  }

  /**
   * Stores the subscription in the database, handling both new and renewal cases.
   */
  private async storeSubscription(
    userId: string,
    productId: string,
    priceId: string,
    status: StripeSubscriptionStatus,
    stripeSubscription: Stripe.Response<Stripe.Subscription>,
    existingSubscription?: StripeSubscriptionDocument,
  ) {
    if (existingSubscription?.status === StripeSubscriptionStatus.CANCELED) {
      // Handle renewals
      if (existingSubscription?._id) {
        // Note: we can add failure message and code if needed
        // await this.stripeSubscriptionRepo.updateById(existingSubscription._id, { userId, productId, priceId, status, subscriptionObject: stripeSubscription });
      }
    } else {
      await this.stripeSubscriptionRepo.create({
        userId,
        productId,
        priceId,
        status,
        subscriptionObject: stripeSubscription,
      });
    }
  }

  /**
   * Updates the subscription end date for active or trialing subscriptions.
   */
  private async updateSubscriptionEndDate(
    userId: string,
    status: StripeSubscriptionStatus,
    isRenewing: boolean,
    stripeSubscription: Stripe.Response<Stripe.Subscription>,
    existingSubscription?: StripeSubscriptionDocument,
  ) {
    if (
      status === StripeSubscriptionStatus.ACTIVE ||
      status === StripeSubscriptionStatus.TRIALING
    ) {
      let stripeSubscriptionEndsAt = new Date(stripeSubscription.current_period_end * 1000);

      if (status === StripeSubscriptionStatus.ACTIVE && isRenewing) {
        const remainingPeriodInMs =
          existingSubscription?.subscriptionObject?.current_period_end * 1000 - Date.now();
        stripeSubscriptionEndsAt =
          remainingPeriodInMs > 0
            ? new Date(stripeSubscription.current_period_end * 1000 + remainingPeriodInMs)
            : stripeSubscriptionEndsAt;
      }

      await this.usersRepository.updateById(userId, { stripeSubscriptionEndsAt });
    }
  }

  /**
   * @description get current subscription of the user
   * @param {string} userId  user id
   * @returns {Promise<StripeSubscriptionResponse>}
   */
  async getCurrentSubscription(userId: string) {
    try {
      const subscription = await this.stripeSubscriptionRepo.findOne({
        userId,
      });
      if (subscription?.subscriptionObject) {
        subscription.subscriptionObject = {
          subscriptionId: subscription.subscriptionObject.id,
          subscriptionStart: new Date(subscription.subscriptionObject?.current_period_start * 1000),
          subscriptionEnd: new Date(subscription.subscriptionObject?.current_period_end * 1000),
          latestInvoice: subscription.subscriptionObject?.latest_invoice?.id,

          subscriptionAmount:
            (subscription.subscriptionObject?.latest_invoice?.amount_paid || 0) / 100,

          subscriptionCurrency: subscription.subscriptionObject?.latest_invoice?.currency,

          isTrial:
            subscription.subscriptionObject?.trial_end &&
            subscription.subscriptionObject?.current_period_end ===
              subscription.subscriptionObject?.trial_end,
        };
      }
      return subscription;
    } catch (error: any) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * @description update stripe subscription
   * @param {string} userId
   * @param {UpdateStripeSubscriptionInput} updateData udpate subscription data
   * @returns {Promise<MessageResponse>}
   */
  async update(
    userId: string,
    updateData: UpdateStripeSubscriptionInput,
  ): Promise<MessageResponse> {
    const { productId, priceId, isUpgrade } = updateData;
    try {
      const subscription = await this.stripeSubscriptionRepo.findOne({
        userId,
      });
      if (!isUpgrade && subscription?.status !== StripeSubscriptionStatus.ACTIVE) {
        throw new BadRequestException(
          this.i18nService.t('stripe_subscriptions.update_not_allowed'),
        );
      }
      const subscriptionId = subscription?.subscriptionObject?.id;
      if (subscriptionId) {
        const subscriptionItemId = subscription?.subscriptionObject?.items?.data[0]?.id;
        const updatedSubscription = await this.stripeService.updateSubscription(
          subscriptionId,
          priceId,
          subscriptionItemId,
        );
        await this.stripeSubscriptionRepo.updateOne(
          { userId },
          {
            productId,
            priceId,
            status: StripeSubscriptionStatusMap[updatedSubscription.status],
            subscriptionObject: updatedSubscription,
          },
        );

        if (updatedSubscription.status === SUBSCRIPTION_STATUS.ACTIVE) {
          await this.usersRepository.updateById(userId, {
            stripeSubscriptionEndsAt: new Date(updatedSubscription.current_period_end * 1000),
          });
        }

        return {
          message: this.i18nService.t('stripe_subscriptions.update_successfully'),
        };
      }
    } catch (error: any) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * @description cancel stripe subscription
   * @param {string} userId
   * @returns {Promise<MessageResponse>}
   */
  async cancelSubscription(userId: string): Promise<MessageResponse> {
    try {
      const subscription = await this.stripeSubscriptionRepo.findOne({
        userId,
      });
      if (!subscription || subscription.status != StripeSubscriptionStatus.ACTIVE) {
        throw new BadRequestException(
          this.i18nService.t('stripe_subscriptions.no_sunscription_to_cancel'),
        );
      }
      const subscriptionId = subscription?.subscriptionObject?.id;
      if (subscriptionId) {
        const canceledSubscription = await this.stripeService.cancelSubscription(subscriptionId);
        if (canceledSubscription && canceledSubscription.status === SUBSCRIPTION_STATUS.CANCELED) {
          subscription.subscriptionObject = canceledSubscription;
          subscription.status = StripeSubscriptionStatus.CANCELED;
          await subscription.save();
        }
      }

      return {
        message: this.i18nService.t('stripe_subscriptions.canceled_successfully'),
      };
    } catch (error: any) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * @description manually end trial period
   * @param {string} userId
   * @returns {Promise<MessageResponse>}
   */
  async endTrial(userId: string): Promise<MessageResponse> {
    try {
      const subscription = await this.stripeSubscriptionRepo.findOne({
        userId,
      });
      if (
        !subscription ||
        subscription.status !== StripeSubscriptionStatus.TRIALING ||
        !subscription.subscriptionObject?.trial_start
      ) {
        throw new BadRequestException(
          this.i18nService.t('stripe_subscriptions.no_subscription_trial_end'),
        );
      }

      if (
        subscription.subscriptionObject?.canceled_at ||
        (subscription.subscriptionObject?.trial_end &&
          Number(subscription.subscriptionObject.trial_end) * 1000 < Date.now())
      ) {
        throw new BadRequestException(
          this.i18nService.t('stripe_subscriptions.subscription_trial_already_canceled'),
        );
      }

      const subscriptionId = subscription?.subscriptionObject?.id;
      const canceledTrialSubscription = await this.stripeService.cancelSubscription(subscriptionId);
      if (canceledTrialSubscription?.canceled_at) {
        subscription.subscriptionObject = canceledTrialSubscription;
        subscription.status = StripeSubscriptionStatus.CANCELED;
        await subscription.save();
      }
      return {
        message: this.i18nService.t('stripe_subscriptions.trial_ended_successfully'),
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
