import { StripeConnectWebhookGuard } from '@api/guards/stripe-connect-webhook.guard';
import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { StripeWebhookService } from '../stripe-webhook.service';

@Controller('/stripe-webhook')
export class StripeConnectWebhookController {
  constructor(private readonly stripeWebhookService: StripeWebhookService) {}

  @Post('/connect-account')
  @UseGuards(StripeConnectWebhookGuard)
  handlePaymentConnectAccount(@Req() req: Request) {
    const event = req['stripeEvent'];
    if (!event) {
      return false;
    }
    return this.stripeWebhookService.handleAction(event);
  }
}
