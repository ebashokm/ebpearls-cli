import { StripeService } from '@app/stripe';
import { Injectable, Logger } from '@nestjs/common';
import { ManualSubscriptionService } from './manual-subscription.service';
import { PaymentProvider } from '@app/common/enum/payment-provider.enum';
import Stripe from 'stripe';
import { BillingCycle } from '@app/common/enum/billing-cycle.enum';

@Injectable()
export class SubscriptionWebhookService {
  private readonly logger = new Logger(SubscriptionWebhookService.name);
  constructor(
    private readonly stripeService: StripeService,
    private readonly manualSubscriptionService: ManualSubscriptionService,
  ) {}

  private async handleStripePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
    const metadata = paymentIntent.metadata;

    // Check if this is a subscription payment
    if (!metadata.subscriptionType || metadata.subscriptionType !== 'initial') {
      this.logger.log('Payment intent not for subscription, skipping');
      return;
    }

    try {
      await this.manualSubscriptionService.activateSubscriptionAfterPayment({
        userId: metadata.userId,
        planId: metadata.planId,
        billingCycle: BillingCycle[metadata.billingCycle as keyof typeof BillingCycle],
        paymentProvider: PaymentProvider.STRIPE,
        providerPaymentId: paymentIntent.id,
        providerCustomerId: paymentIntent.customer as string,
        amount: paymentIntent.amount / 100, // Convert from cents
      });

      this.logger.log(
        `Subscription activated for user ${metadata.userId} after payment ${paymentIntent.id}`,
      );
    } catch (error) {
      this.logger.error('Error creating subscription after payment:', error);
    }
  }

  private async handlePayPalPaymentCaptured(capture: any) {
    try {
      // Extract metadata from custom_id
      const customId = capture.supplementary_data?.related_ids?.order_id;

      if (!customId) {
        this.logger.warn('No custom ID found in PayPal capture');
        return;
      }

      // You'll need to store order metadata when creating the order
      // and retrieve it here to create the subscription

      this.logger.log(`PayPal payment captured: ${capture.id}`);

      // Create subscription after successful capture
      // Note: You'll need to store order metadata in a temporary collection
      // or include it in the custom_id field as JSON string
    } catch (error) {
      this.logger.error('Error processing PayPal capture:', error);
    }
  }

  async handleStripeEvent(event: Stripe.Event) {
    this.logger.log(`Handling Stripe event: ${event.type}`);

    switch (event.type) {
      case 'payment_intent.succeeded':
        await this.handleStripePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent);
        break;

      //   case 'payment_intent.payment_failed':
      //     await this.handleStripePaymentIntentFailed(event.data.object as Stripe.PaymentIntent);
      //     break;

      //   case 'invoice.payment_succeeded':
      //     await this.handleStripePaymentSucceeded(event.data.object as Stripe.Invoice);
      //     break;

      default:
        this.logger.log(`Unhandled Stripe event type: ${event.type}`);
    }
  }

  async handlePayPalEvent(event: any) {
    this.logger.log(`Handling PayPal event: ${event.event_type}`);

    switch (event.event_type) {
      case 'PAYMENT.CAPTURE.COMPLETED':
        await this.handlePayPalPaymentCaptured(event.resource);
        break;

      //   case 'CHECKOUT.ORDER.APPROVED':
      //     await this.handlePayPalOrderApproved(event.resource);
      //     break;

      default:
        this.logger.log(`Unhandled PayPal event type: ${event.event_type}`);
    }
  }
}
