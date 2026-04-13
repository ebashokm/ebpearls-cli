import { StripeCustomerRepository } from '@app/data-access';
import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';

/**
 * Description placeholder
 *
 * @export
 * @class StripeWebhookService
 * @typedef {StripeWebhookService}
 */
@Injectable()
export class StripeWebhookService {
  /**
   * Description placeholder
   *
   * @type {Stripe}
   */
  stripe: Stripe;

  /**
   * Creates an instance of StripeWebhookService.
   *
   * @constructor
   * @param {StripeCustomerRepository} stripeCustomerRepository
   */
  constructor(private readonly stripeCustomerRepository: StripeCustomerRepository) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET, {
      apiVersion: process.env.STRIPE_API_VERSION as any,
      typescript: true,
    });
  }

  /**
   * Description placeholder
   *
   * @async
   * @param {*} event
   * @returns {*}
   */
  async handleAction(event: Stripe.Event): Promise<void> {
    const eventType = event.type;
    switch (eventType) {
      case 'payment_intent.created':
        break;
      case 'payment_intent.succeeded':
        break;
      case 'payment_intent.payment_failed':
        break;
      case 'payment_intent.amount_capturable_updated':
        break;
      case 'payment_intent.canceled':
        break;
      case 'charge.refunded':
        break;
      case 'charge.captured':
        break;
      default:
        console.log(`Unhandled event type ${eventType}`);
    }
  }
}
