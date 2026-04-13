import { PaypalCoreService } from '@app/paypal-core/paypal-core.service';
import { StripeService } from '@app/stripe';
import { Body, Controller, Headers, Post, RawBodyRequest, Req, Res } from '@nestjs/common';
import { Response, Request } from 'express';
import { SubscriptionWebhookService } from '../subscription-webhook.service';
import Stripe from 'stripe';
import { STRIPE_API_VERSION } from '@api/constants';

@Controller('webhooks')
export class SubscriptionWebhookController {
  private stripe: Stripe;
  constructor(
    private stripeService: StripeService,
    private paypalCoreService: PaypalCoreService,
    private subscriptionWebhookService: SubscriptionWebhookService,
  ) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET, {
      apiVersion: STRIPE_API_VERSION,
      typescript: true,
    });
  }

  @Post('stripe')
  async handleStripeWebhook(
    @Req() req: Request,
    @Res() res: Response,
    @Headers('stripe-signature') signature: string,
  ) {
    console.log('------------ Stripe Payment Intent Webhook --------------');
    let event: Stripe.Event;
    try {
      const buf = (req as any).body;

      if (!buf || !Buffer.isBuffer(buf)) {
        throw new Error('Expected raw buffer body');
      }
      event = this.stripe.webhooks.constructEvent(
        buf,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET,
      );
    } catch (err) {
      console.log(err);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }
    this.subscriptionWebhookService.handleStripeEvent(event);
    return res.status(200).json({ received: true });
  }

  @Post('paypal')
  async handlePayPalWebhook(@Headers() headers: any, @Body() body: any) {
    try {
      //   const isValid = await this.paypalService.verifyWebhook(headers, body);

      //   if (!isValid) {
      //     throw new Error('Invalid webhook signature');
      //   }

      await this.subscriptionWebhookService.handlePayPalEvent(body);

      return { received: true };
    } catch (error) {
      console.error('PayPal webhook error:', error);
      throw error;
    }
  }
}
