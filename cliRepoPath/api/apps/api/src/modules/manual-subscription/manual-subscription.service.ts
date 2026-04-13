import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateManualSubscriptionInput } from './dto/input/create-manual-subscription.input';
import { StripeService } from '@app/stripe';
import { UsersRepository } from '@app/data-access';
import { STRIPE_CURRENCY } from '@app/stripe/constants';
import { PaypalCoreService } from '@app/paypal-core/paypal-core.service';
import { PaymentProvider } from '@app/common/enum/payment-provider.enum';
import { CreateManualSubscriptionResponse } from './dto/response/manual-subscription.response';
import { ManualSubscriptionRepository } from './repository';
import { ManualSubscriptionStatus } from './enum/manual-subscription.status.enum';
import { ActivateManualSubscriptionInput } from './dto/input/activate-manual-subscription.input';
import { CancelSubscriptionInput } from './dto/input/cancel-manual-subscription.input';
import { PaypalOrderRepository } from '../paypal/paypal-order/repository';
import { PaypalOrderStatus } from '../paypal/paypal-order/enum/paypal-order-status.enum';
import { PaypalTransactionType } from '../paypal/paypal-order/enum/paypal-transaction-type.enum';
import { SubscriptionPlanRepository } from '@app/data-access/subscription-plan';
import { SubscriptionPlanStatus } from '@app/data-access/subscription-plan/enum/subscription-plan.enum';
import { ResumeManualSubscriptionInput } from './dto/input/resume-manual-subscription.input';
import { PauseManualSubscriptionInput } from './dto/input/pause-manual-subscription.input';

@Injectable()
export class ManualSubscriptionService {
  private readonly logger = new Logger(ManualSubscriptionService.name);
  constructor(
    private readonly stripeService: StripeService,
    private readonly paypalService: PaypalCoreService,
    private readonly usersRepository: UsersRepository,
    private readonly manualSubscriptionRepository: ManualSubscriptionRepository,
    private readonly paypalOrderRepository: PaypalOrderRepository,
    private readonly planRepository: SubscriptionPlanRepository,
  ) {}

  async createSubscription(
    input: CreateManualSubscriptionInput,
    user,
  ): Promise<CreateManualSubscriptionResponse> {
    const { planId, paymentProvider, billingCycle, paymentMethodId } = input;
    try {
      const plan = await this.planRepository.findById(planId);
      if (!plan) {
        throw new NotFoundException('Plan not found');
      }

      // TODO: validate plan and get finalAmount from plan service(api),
      // await this.planService.validatePlanAvailability(planId);
      // const finalAmount = await this.planService.calculateFinalAmount(planId);

      if (plan.status !== SubscriptionPlanStatus.ACTIVE) {
        throw new BadRequestException('Plan is not active');
      }

      const finalAmount = plan.amount;

      const userInfo = await this.usersRepository.findById(user.userId);

      if (!userInfo) {
        throw new NotFoundException('User not found');
      }

      if (paymentProvider === PaymentProvider.STRIPE) {
        const customer = await this.stripeService.getOrCreateCustomer(
          String(userInfo._id),
          userInfo?.email,
        );
        const paymentIntentData: any = {
          amount: Math.round(finalAmount * 100),
          currency: STRIPE_CURRENCY,
          customer: customer.id,
          automatic_payment_methods: {
            enabled: true,
            allow_redirects: 'never',
          },
          metadata: {
            userId: userInfo._id.toString(),
            planId: planId.toString(),
            billingCycle: String(billingCycle),
          },
        };
        if (paymentMethodId) {
          paymentIntentData['payment_method'] = paymentMethodId;
          paymentIntentData['confirm'] = true;
          paymentIntentData['off_session'] = false;
          paymentIntentData['description'] = `Payment to ${plan.name} plan`;
          paymentIntentData['setup_future_usage'] = 'off_session'; // tells Stripe to save card to customer
        }
        const paymentIntent = await this.stripeService.createPaymentIntent(paymentIntentData);

        await this.manualSubscriptionRepository.create({
          userId: userInfo._id,
          paymentProvider,
          planId: plan._id,
          planName: plan.name,
          billingCycle,
          amount: plan.amount,
          currency: STRIPE_CURRENCY,
          status: ManualSubscriptionStatus.ACTIVE,
          providerCustomerId: customer.id,
          stripeInvoiceId: paymentIntent.id,
          subscriptionStartDate: new Date(),
          currentPeriodStart: new Date(),
          currentPeriodEnd: this.calculatePeriodEnd(billingCycle),
          lastPaymentDate: new Date(),
          nextPaymentDate: this.calculatePeriodEnd(billingCycle),
        });

        return {
          success: true,
          message: 'Payment intent created successfully.',
          paymentIntentId: paymentIntent.id,
          clientSecret: paymentIntent.client_secret,
          requiresAction: paymentIntent.status === 'requires_action',
        };
      } else if (paymentProvider === PaymentProvider.PAYPAL) {
        const paypalOrder = await this.paypalService.createOrder({
          amount: finalAmount,
          currency: 'aud', // take from config
          quantity: 1,
          itemName: plan.name,
          userId: String(user._id),
        });

        const approvalLink = paypalOrder.links.find((link: any) => link.rel === 'approve');
        if (!approvalLink) {
          throw new BadRequestException('No approval link found');
        }

        await this.paypalOrderRepository.create({
          userId: String(user?._id),
          status: PaypalOrderStatus.PENDING,
          transactionType: PaypalTransactionType.ONE_TIME_PAYMENT,
          paypalOrderId: paypalOrder.id,
          amount: plan.amount,
          currency: 'aud',
          itemName: plan.name,
          quantity: 1,
          response: paypalOrder,
        });

        return {
          success: true,
          message: 'PayPal order created. Please complete the payment.',
          orderId: paypalOrder.id,
          approvalUrl: approvalLink.href,
        };
      }
    } catch (error: any) {
      throw error;
    }
  }

  async capturePaypalOrder(orderId: string, user: any) {
    try {
      const userInfo = await this.usersRepository.findById(user.userId);
      if (!userInfo) {
        throw new NotFoundException('User not found');
      }

      //TODO: get the saved order details from DB to retrieve planId and billingCycle
      const plan = await this.planRepository.findById('planId');

      const order = await this.paypalOrderRepository.findOne({
        paypalOrderId: orderId,
      });
      if (!order) {
        throw new NotFoundException('PayPal order not found');
      }
      if (order.status === PaypalOrderStatus.COMPLETED) {
        throw new BadRequestException('Order already captured');
      }

      const captureResult = await this.paypalService.captureOrder(orderId);
      if (!captureResult) {
        throw new BadRequestException('Failed to capture PayPal order');
      }
      if (captureResult.status !== 'COMPLETED') {
        this.logger.error(`PayPal capture failed`, captureResult);
        throw new BadRequestException('PayPal payment not completed');
      }

      await this.paypalOrderRepository.updateOne(
        {
          paypalOrderId: orderId,
        },
        {
          status: PaypalOrderStatus.COMPLETED,
        },
      );

      await this.manualSubscriptionRepository.create({
        userId: userInfo._id,
        paymentProvider: PaymentProvider.PAYPAL,
        planId: plan._id,
        planName: plan.name,
        billingCycle: plan.interval,
        amount: plan.amount,
        currency: STRIPE_CURRENCY,
        status: ManualSubscriptionStatus.ACTIVE,
        subscriptionStartDate: new Date(),
        currentPeriodStart: new Date(),
        currentPeriodEnd: this.calculatePeriodEnd(plan.interval),
        lastPaymentDate: new Date(),
        nextPaymentDate: this.calculatePeriodEnd(plan.interval),
      });
      return {
        message: 'PayPal order captured and subscription created successfully.',
      };
    } catch (error) {
      throw error;
    }
  }

  // New method: Called by webhook after successful payment
  async activateSubscriptionAfterPayment(data: ActivateManualSubscriptionInput) {
    const plan = await this.planRepository.findById(data.planId);
    if (!plan) {
      throw new NotFoundException('Plan not found');
    }

    const existingSubscription = await this.manualSubscriptionRepository.findOne({
      userId: data.userId,
      status: { $in: [ManualSubscriptionStatus.ACTIVE, ManualSubscriptionStatus.TRIALLING] },
    });

    if (existingSubscription) {
      throw new BadRequestException('User already has an active subscription');
    }

    const currentPeriodStart = new Date();
    const currentPeriodEnd = this.calculatePeriodEnd(data.billingCycle);

    // Create subscription in database after successful payment
    const subscription = await this.manualSubscriptionRepository.create({
      userId: data.userId,
      paymentProvider: data.paymentProvider,
      planId: data.planId,
      planName: plan.name,
      amount: data.amount,
      billingCycle: data.billingCycle,
      status: ManualSubscriptionStatus.ACTIVE,
      providerCustomerId: data.providerCustomerId,
      currentPeriodStart,
      currentPeriodEnd,
      lastPaymentDate: new Date(),
      nextPaymentDate: currentPeriodEnd,
    });

    return subscription;
  }

  async cancelSubscription(input: CancelSubscriptionInput, user) {
    const { subscriptionId, cancellationReason, cancelAtPeriodEnd } = input;

    const subscription = await this.manualSubscriptionRepository.findOne({
      _id: subscriptionId,
      userId: user.userId,
    });

    if (!subscription) {
      throw new NotFoundException('Subscription not found');
    }

    if (subscription.status === ManualSubscriptionStatus.CANCELLED) {
      throw new BadRequestException('Subscription is already cancelled');
    }

    const cancellationDate = new Date();

    try {
      if (cancelAtPeriodEnd) {
        subscription.cancelAtPeriodEnd = true;
      } else {
        subscription.status = ManualSubscriptionStatus.CANCELLED;
        subscription.cancelledAt = cancellationDate;
        subscription.nextPaymentDate = null;
        subscription.cancellationReason = cancellationReason || 'User cancelled the subscription';
      }

      await subscription.save();

      return {
        success: true,
        subscription,
        message: cancelAtPeriodEnd
          ? 'Subscription will be cancelled at the end of the billing period'
          : 'Subscription cancelled immediately',
      };
    } catch (error) {
      throw new BadRequestException(`Failed to cancel subscription: ${error.message}`);
    }
  }

  // async updateSubscription(userId: string, input: UpdateSubscriptionInput) {
  //   const { subscriptionId, planId, billingCycle } = input;

  //   const subscription = await this.subscriptionModel.findOne({
  //     _id: subscriptionId,
  //     userId,
  //   });

  //   if (!subscription) {
  //     throw new NotFoundException('Subscription not found');
  //   }

  //   if (subscription.status !== SubscriptionStatus.ACTIVE) {
  //     throw new BadRequestException('Only active subscriptions can be updated');
  //   }

  //   try {
  //     if (planId) {
  //       const plan = await this.getPlanDetails(planId);

  //       if (subscription.paymentProvider === PaymentProvider.STRIPE) {
  //         await this.stripeService.updateSubscription(
  //           subscription.providerSubscriptionId,
  //           plan.stripePriceId,
  //         );
  //       } else if (subscription.paymentProvider === PaymentProvider.PAYPAL) {
  //         await this.paypalService.updateSubscription(
  //           subscription.providerSubscriptionId,
  //           plan.paypalPlanId,
  //         );
  //       }

  //       subscription.planId = planId;
  //       subscription.planName = plan.name;
  //       subscription.amount = plan.amount;
  //     }

  //     if (billingCycle) {
  //       subscription.billingCycle = billingCycle;
  //       subscription.currentPeriodEnd = this.calculatePeriodEnd(billingCycle);
  //       subscription.nextPaymentDate = this.calculatePeriodEnd(billingCycle);
  //     }

  //     await subscription.save();

  //     return {
  //       success: true,
  //       subscription,
  //     };
  //   } catch (error) {
  //     throw new BadRequestException(`Failed to update subscription: ${error.message}`);
  //   }
  // }

  // async pauseSubscription(userId: string, input: PauseSubscriptionInput) {
  //   const { subscriptionId, resumeAt } = input;

  //   const subscription = await this.subscriptionModel.findOne({
  //     _id: subscriptionId,
  //     userId,
  //   });

  //   if (!subscription) {
  //     throw new NotFoundException('Subscription not found');
  //   }

  //   if (subscription.status !== SubscriptionStatus.ACTIVE) {
  //     throw new BadRequestException('Only active subscriptions can be paused');
  //   }

  //   try {
  //     const resumeDate = resumeAt ? new Date(resumeAt) : undefined;

  //     if (subscription.paymentProvider === PaymentProvider.STRIPE) {
  //       await this.stripeService.pauseSubscription(subscription.providerSubscriptionId, resumeDate);
  //     } else if (subscription.paymentProvider === PaymentProvider.PAYPAL) {
  //       await this.paypalService.suspendSubscription(
  //         subscription.providerSubscriptionId,
  //         'User requested pause',
  //       );
  //     }

  //     subscription.status = SubscriptionStatus.PAUSED;
  //     subscription.pausedAt = new Date();
  //     if (resumeDate) {
  //       subscription.resumeAt = resumeDate;
  //     }

  //     await subscription.save();

  //     return {
  //       success: true,
  //       subscription,
  //     };
  //   } catch (error) {
  //     throw new BadRequestException(`Failed to pause subscription: ${error.message}`);
  //   }
  // }

  // async resumeSubscription(userId: string, subscriptionId: string) {
  //   const subscription = await this.subscriptionModel.findOne({
  //     _id: subscriptionId,
  //     userId,
  //   });

  //   if (!subscription) {
  //     throw new NotFoundException('Subscription not found');
  //   }

  //   if (subscription.status !== SubscriptionStatus.PAUSED) {
  //     throw new BadRequestException('Only paused subscriptions can be resumed');
  //   }

  //   try {
  //     if (subscription.paymentProvider === PaymentProvider.STRIPE) {
  //       await this.stripeService.resumeSubscription(subscription.providerSubscriptionId);
  //     } else if (subscription.paymentProvider === PaymentProvider.PAYPAL) {
  //       await this.paypalService.activateSubscription(
  //         subscription.providerSubscriptionId,
  //         'User requested resume',
  //       );
  //     }

  //     subscription.status = SubscriptionStatus.ACTIVE;
  //     subscription.pausedAt = undefined;
  //     subscription.resumeAt = undefined;

  //     await subscription.save();

  //     return {
  //       success: true,
  //       subscription,
  //     };
  //   } catch (error) {
  //     throw new BadRequestException(`Failed to resume subscription: ${error.message}`);
  //   }
  // }

  async getUserSubscriptions(userId: string) {
    try {
      return this.manualSubscriptionRepository.find({ userId }, null, {
        sort: { createdAt: -1 },
      });
    } catch (error) {
      throw error;
    }
  }

  async getSubscriptionById(userId: string, subscriptionId: string) {
    try {
      const subscription = await this.manualSubscriptionRepository.findOne({
        _id: subscriptionId,
        userId,
      });

      if (!subscription) {
        throw new NotFoundException('Subscription not found');
      }

      return subscription;
    } catch (error) {
      throw error;
    }
  }

  async pauseSubscription(input: PauseManualSubscriptionInput, userId: string) {
    const { subscriptionId, resumeAt } = input;

    try {
      const subscription = await this.manualSubscriptionRepository.findOne({
        _id: subscriptionId,
        userId,
      });

      if (!subscription) {
        throw new NotFoundException('Subscription not found');
      }

      if (subscription.status !== ManualSubscriptionStatus.ACTIVE) {
        throw new BadRequestException('Only active subscriptions can be paused');
      }

      const resumeDate = resumeAt ? new Date(resumeAt) : undefined;
      subscription.status = ManualSubscriptionStatus.PAUSED;
      subscription.pausedAt = new Date();
      if (resumeDate) {
        subscription.resumeAt = resumeDate;
      }

      await subscription.save();

      return subscription;
    } catch (error) {
      throw error;
    }
  }

  async resumeSubscription(input: ResumeManualSubscriptionInput, userId: string) {
    const { subscriptionId } = input;
    try {
      const subscription = await this.manualSubscriptionRepository.findOne({
        _id: subscriptionId,
        userId,
      });

      if (!subscription) {
        throw new NotFoundException('Subscription not found');
      }

      if (subscription.status !== ManualSubscriptionStatus.PAUSED) {
        throw new BadRequestException('Only paused subscriptions can be resumed');
      }

      subscription.status = ManualSubscriptionStatus.ACTIVE;
      subscription.pausedAt = undefined;
      subscription.resumeAt = undefined;

      await subscription.save();

      return subscription;
    } catch (error) {
      throw error;
    }
  }

  private calculatePeriodEnd(billingCycle: string): Date {
    const now = new Date();
    switch (billingCycle) {
      case 'MONTHLY':
        return new Date(now.setMonth(now.getMonth() + 1));
      case 'QUARTERLY':
        return new Date(now.setMonth(now.getMonth() + 3));
      case 'YEARLY':
        return new Date(now.setFullYear(now.getFullYear() + 1));
      default:
        return new Date(now.setMonth(now.getMonth() + 1));
    }
  }
}
