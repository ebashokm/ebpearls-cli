import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { StripeSubscriptionWebhookService } from '../stripe-subscriptions-webhook.service';
import { StripeWebhookGuard } from '@api/guards/stripe-webhook.guard';
import { Request, Response } from 'express';

@Controller('/stripe-webhook')
export class StripeSubscriptionWebhookController {
  constructor(
    private readonly stripeSubscriptionWebhookService: StripeSubscriptionWebhookService,
  ) {}
  @Post('/subscription')
  @UseGuards(StripeWebhookGuard)
  async handleSubscriptionWebhook(
    @Body() body: Body,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const event = req['stripeEvent'];
    if (!event) {
      return false;
    }
    return this.stripeSubscriptionWebhookService.handleStripeSubscriptionWebhook(
      event,
      res,
    );
  }
}
