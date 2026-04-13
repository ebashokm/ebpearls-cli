import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import Stripe from 'stripe';

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class StripeConnectWebhookGuard
 * @typedef {StripeConnectWebhookGuard}
 * @implements {CanActivate}
 */
@Injectable()
export class StripeConnectWebhookGuard implements CanActivate {
  /**
   * ${1:Description placeholder}
   *
   * @param {ExecutionContext} context
   * @returns {(boolean | Promise<boolean>)}
   */
  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const stripe = new Stripe(process.env.STRIPE_CONNECT_WEBHOOK_SECRET, {
      apiVersion: '2024-06-20',
    });

    const signature = req.headers['stripe-signature'];
    if (!signature) {
      return false;
    }
    let event;
    try {
      // create and log stripe-signature for postman testing
      // const secret = process.env.STRIPE_WEBHOOK_SECRET; // 'whsec_...'
      // const webhookData = JSON.stringify(req.body);
      // const newsignature = crypto
      //   .createHmac('sha256', secret)
      //   .update(webhookData)
      //   .digest('hex');
      // console.log({ newsignature });
      event = stripe.webhooks.constructEvent(
        req.body,
        signature,
        process.env.STRIPE_CONNECT_WEBHOOK_SECRET,
      );
    } catch (error: any) {
      console.log(error, '===StripeConnectWebhookGuard===');
      return false;
    }
    req['stripeEvent'] = event;
    return true;
  }
}
