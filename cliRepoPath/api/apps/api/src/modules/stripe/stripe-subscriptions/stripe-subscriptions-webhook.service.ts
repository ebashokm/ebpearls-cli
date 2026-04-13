import {
  StripeCustomerRepository,
  StripeSubscriptionRepository,
  UsersRepository,
} from '@app/data-access';
import { StripeSubscriptionStatus } from '@app/common/enum/stripe-subscription.enum';
import { Injectable } from '@nestjs/common';
import { Response } from 'express';

@Injectable()
export class StripeSubscriptionWebhookService {
  constructor(
    private readonly stripeSubscriptionRepository: StripeSubscriptionRepository,
    private readonly stripeCustomerRepository: StripeCustomerRepository,
    private readonly userRepository: UsersRepository,
  ) {}

  // webhook request format for invoice succeed
  // event = {
  //   "id": "evt_1Ml912BvETHe3RKX3b6bftAl",
  //   "object": "event",
  //   "api_version": "2022-08-01",
  //   "created": 1678704847,
  //   "data": {
  //     "object": {
  //       "id": "in_1Ml90zBvETHe3RKXB0zzfSgt",
  //       "object": "invoice",
  //       "account_country": "AU",
  //       "account_name": "Sentiment Operations Pty Ltd",
  //       "account_tax_ids": null,
  //       "amount_due": 15000,
  //       "amount_paid": 15000,
  //       "amount_remaining": 0,
  //       "amount_shipping": 0,
  //       "application": null,
  //       "application_fee_amount": null,
  //       "attempt_count": 1,
  //       "attempted": true,
  //       "auto_advance": false,
  //       "automatic_tax": {
  //         "enabled": false,
  //         "status": null
  //       },
  //       "billing_reason": "subscription_create",
  //       "charge": "ch_3Ml90zBvETHe3RKX0oYwT4Yu",
  //       "collection_method": "charge_automatically",
  //       "created": 1678704845,
  //       "currency": "aud",
  //       "custom_fields": null,
  //       "customer": "cus_NW8inb7hbCs8vz",
  //       "customer_address": null,
  //       "customer_email": "testsol13@getnada.com",
  //       "customer_name": "test sol 13",
  //       "customer_phone": null,
  //       "customer_shipping": null,
  //       "customer_tax_exempt": "none",
  //       "customer_tax_ids": [
  //       ],
  //       "default_payment_method": null,
  //       "default_source": null,
  //       "default_tax_rates": [
  //       ],
  //       "description": null,
  //       "discount": null,
  //       "discounts": [
  //       ],
  //       "due_date": null,
  //       "ending_balance": 0,
  //       "footer": null,
  //       "from_invoice": null,
  //       "hosted_invoice_url": "https://invoice.stripe.com/i/acct_1LvYfvBvETHe3RKX/test_YWNjdF8xTHZZZnZCdkVUSGUzUktYLF9OV0JON0E4OW16aGtDcmpDZmN4eUM4VTI4V0RXcEc3LDY5MjQ1NjQ40200Kzq3X1EA?s=ap",
  //       "invoice_pdf": "https://pay.stripe.com/invoice/acct_1LvYfvBvETHe3RKX/test_YWNjdF8xTHZZZnZCdkVUSGUzUktYLF9OV0JON0E4OW16aGtDcmpDZmN4eUM4VTI4V0RXcEc3LDY5MjQ1NjQ40200Kzq3X1EA/pdf?s=ap",
  //       "last_finalization_error": null,
  //       "latest_revision": null,
  //       "lines": {...}
  //       "livemode": false,
  //       "metadata": {
  //       },
  //       "next_payment_attempt": null,
  //       "number": "5F2A3C66-0002",
  //       "on_behalf_of": null,
  //       "paid": true,
  //       "paid_out_of_band": false,
  //       "payment_intent": "pi_3Ml90zBvETHe3RKX0nMse0Jp",
  //       "payment_settings": {
  //         "default_mandate": null,
  //         "payment_method_options": null,
  //         "payment_method_types": null
  //       },
  //       "period_end": 1678704845,
  //       "period_start": 1678704845,
  //       "post_payment_credit_notes_amount": 0,
  //       "pre_payment_credit_notes_amount": 0,
  //       "quote": null,
  //       "receipt_number": null,
  //       "rendering_options": null,
  //       "shipping_cost": null,
  //       "shipping_details": null,
  //       "starting_balance": 0,
  //       "statement_descriptor": null,
  //       "status": "paid",
  //       "status_transitions": {
  //         "finalized_at": 1678704845,
  //         "marked_uncollectible_at": null,
  //         "paid_at": 1678704845,
  //         "voided_at": null
  //       },
  //       "subscription": "sub_1Ml90zBvETHe3RKXFH2LF9OL",
  //       "subtotal": 15000,
  //       "subtotal_excluding_tax": 15000,
  //       "tax": null,
  //       "test_clock": null,
  //       "total": 15000,
  //       "total_discount_amounts": [
  //       ],
  //       "total_excluding_tax": 15000,
  //       "total_tax_amounts": [
  //       ],
  //       "transfer_data": null,
  //       "webhooks_delivered_at": 1678704845
  //     }
  //   },
  //   "livemode": false,
  //   "pending_webhooks": 1,
  //   "request": {
  //     "id": "req_MnSO3nY51Az64k",
  //     "idempotency_key": "d3896b5f-09dc-4be9-b504-5e4dacb4ef40"
  //   },
  //   "type": "invoice.payment_succeeded"
  // };

  async handleStripeSubscriptionWebhook(event: any, response: Response) {
    try {
      const { type, data } = event;
      const stripeCustomerInfo = await this.getStripeCustomerInfo(data.object.customer);

      if (!stripeCustomerInfo) {
        return response.status(404).json({ message: 'Customer not found' });
      }

      const handlers: Record<string, Function> = {
        'invoice.payment_succeeded': () => this.handlePaymentSucceeded(stripeCustomerInfo.userId),
        'invoice.payment_failed': () => this.handlePaymentFailed(stripeCustomerInfo.userId),
        'customer.subscription.created': () =>
          this.handleSubscriptionCreated(stripeCustomerInfo.userId, data.object),
        'customer.subscription.updated': () =>
          this.handleSubscriptionUpdated(stripeCustomerInfo.userId, data.object),
        'customer.subscription.deleted': () =>
          this.handleSubscriptionDeleted(stripeCustomerInfo.userId, data.object),
      };

      if (handlers[type]) {
        await handlers[type]();
      } else {
        console.log(`Unhandled event type ${type}`);
      }

      response.status(200).send('Webhook Received');
    } catch (error) {
      console.error(`Error handling webhook: ${error}`);
      response.status(500).json({ message: 'Internal Server Error' });
    }
  }

  private async getStripeCustomerInfo(customerId: string) {
    return this.stripeCustomerRepository.findOne({ customerId });
  }

  private async handlePaymentSucceeded(userId) {
    try {
      await this.stripeSubscriptionRepository.updateOne(
        { userId },
        { status: StripeSubscriptionStatus.ACTIVE },
      );
    } catch (error) {
      console.error(`Error handling invoice payment success: ${error}`);
    }
  }

  private async handlePaymentFailed(userId) {
    try {
      await this.stripeSubscriptionRepository.updateOne(
        { userId },
        { status: StripeSubscriptionStatus.REJECTED },
      );
    } catch (error) {
      console.error(`Error handling invoice payment failed: ${error}`);
    }
  }

  private async handleSubscriptionCreated(userId, subscriptionObject: any) {
    try {
      await this.stripeSubscriptionRepository.updateOne({ userId }, { subscriptionObject });
      await this.userRepository.updateById(userId, {
        stripeSubscriptionEndsAt: new Date(subscriptionObject.current_period_end * 1000),
      });
    } catch (error) {
      console.error(`Error handling customer subscription create: ${error}`);
    }
  }

  private async handleSubscriptionUpdated(userId, subscriptionObject: any) {
    try {
      const subscription = await this.stripeSubscriptionRepository.findOne({ userId });
      if (
        subscription?.status !== StripeSubscriptionStatus.ACTIVE &&
        subscriptionObject?.status === 'active'
      ) {
        await this.stripeSubscriptionRepository.updateOne(
          { userId },
          { status: StripeSubscriptionStatus.ACTIVE, subscriptionObject },
        );
        await this.userRepository.updateById(userId, {
          stripeSubscriptionEndsAt: new Date(subscriptionObject.current_period_end * 1000),
        });
      }
    } catch (error) {
      console.error(`Error handling customer subscription update: ${error}`);
    }
  }

  private async handleSubscriptionDeleted(userId, subscriptionObject: any) {
    try {
      const subscriptionInfo = await this.stripeSubscriptionRepository.findOne({ userId });
      if (subscriptionInfo?.status !== StripeSubscriptionStatus.CANCELED) {
        subscriptionInfo.subscriptionObject = subscriptionObject;
        subscriptionInfo.status = StripeSubscriptionStatus.CANCELED;
        await subscriptionInfo.save();
      }
    } catch (error) {
      console.error(`Error handling customer subscription cancellation: ${error}`);
    }
  }

  // async handleStripeSubscriptionWebhook(event: any, response: Response) {

  //   const { type, data } = event;
  //   const stripeCustomerInfo = await this.stripeCustomerRepository.findOne({
  //     customerId: data.object.customer,
  //   });
  //   if (!stripeCustomerInfo) {
  //     return response.status(404).json({
  //       message: 'Customer not found',
  //     });
  //   }
  //   switch (type) {
  //     case 'invoice.payment_succeeded':
  //       // handle payment success
  //       try {
  //         await this.stripeSubscriptionRepository.updateOne(
  //           { userId: stripeCustomerInfo.userId },
  //           {
  //             status: StripeSubscriptionStatus.ACTIVE,
  //           },
  //         );
  //         // add logs for create and renew cases} catch (error) {
  //       } catch (error: any) {
  //         console.log(`Error handling invoice payment success: ${error}`);
  //       }
  //       break;

  //     case 'invoice.payment_failed':
  //       // handle payment failure
  //       try {
  //         await this.stripeSubscriptionRepository.updateOne(
  //           { userId: stripeCustomerInfo.userId },
  //           {
  //             status: StripeSubscriptionStatus.REJECTED,
  //           },
  //         );
  //       } catch (error: any) {
  //         console.log(`Error handling invoice payment failed: ${error}`);
  //       }
  //       // add logs for renew failed cases
  //       break;

  //     case 'customer.subscription.created':
  //       // handle subscription created case
  //       try {
  //         await this.stripeSubscriptionRepository.updateOne(
  //           { userId: stripeCustomerInfo.userId },
  //           {
  //             subscriptionObject: data.object,
  //           },
  //         );
  //         await this.userRepository.updateById(stripeCustomerInfo?.userId, {
  //           stripeSubscriptionEndsAt: new Date(data.object.current_period_end * 1000),
  //         });
  //       } catch (error: any) {
  //         console.log(`Error handling customer subscription create: ${error}`);
  //       }
  //       break;

  //     case 'customer.subscription.updated':
  //       // handle subscription updated case
  //       try {
  //         const subscription = await this.stripeSubscriptionRepository.findOne({
  //           userId: stripeCustomerInfo.userId,
  //         });
  //         if (
  //           subscription?.status !== StripeSubscriptionStatus.ACTIVE &&
  //           data.object?.status === 'active'
  //         ) {
  //           await this.stripeSubscriptionRepository.updateOne(
  //             {
  //               userId: stripeCustomerInfo.userId,
  //             },
  //             {
  //               status: StripeSubscriptionStatus.ACTIVE,
  //               subscriptionObject: data.object,
  //             },
  //           );
  //           await this.userRepository.updateById(stripeCustomerInfo.userId, {
  //             stripeSubscriptionEndsAt: new Date(data.object.current_period_end * 1000),
  //           });
  //         }
  //       } catch (error) {
  //         console.log(`Error handling customer subscription update: ${error}`);
  //       }
  //       break;

  //     case 'customer.subscription.deleted':
  //       // subscription canceled case
  //       try {
  //         const subscriptionInfo = await this.stripeSubscriptionRepository.findOne({
  //           userId: stripeCustomerInfo.userId,
  //         });
  //         if (subscriptionInfo && subscriptionInfo.status !== StripeSubscriptionStatus.CANCELED) {
  //           subscriptionInfo.subscriptionObject = data.object;
  //           subscriptionInfo.status = StripeSubscriptionStatus.CANCELED;
  //           await subscriptionInfo.save();
  //           // add logic for subscription logs
  //         }
  //       } catch (error: any) {
  //         console.log(`Error handling customer subscription cancellation: ${error}`);
  //       }
  //       break;
  //     default:
  //       console.log(`Unhandled event type ${event.type}`);
  //       break;
  //   }
  //   response.status(200).send('Webhook Received');
  // }
}
