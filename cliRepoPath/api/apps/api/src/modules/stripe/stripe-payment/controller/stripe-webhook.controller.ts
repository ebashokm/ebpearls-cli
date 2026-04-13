import { StripeWebhookGuard } from '@api/guards/stripe-webhook.guard';
import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { StripeWebhookService } from '../services/stripe-webhook.service';

@Controller('/stripe-webhook')
export class StripePaymentWebhookController {
  constructor(private readonly stripeWebhookService: StripeWebhookService) {}
  @Post('/payment-intents')
  @UseGuards(StripeWebhookGuard)
  handlePaymentIntentWebhook(@Body() body: Body, @Req() req: Request) {
    const event = req['stripeEvent'];
    if (!event) {
      return false;
    }
    return this.stripeWebhookService.handleAction(event);
  }
}
