import { Body, Controller, Post } from '@nestjs/common';
import {
  IAndroidSubscriptionWebhook,
  IosSubscriptionWebhookInterface,
} from '../interfaces/subscription-webhook.interface';
import { SubscriptionService } from '../subscription.service';

@Controller('/subscription-webhook')
export class SubscriptionWebhookController {
  constructor(private readonly subscriptionService: SubscriptionService) {}
  @Post('/android')
  async handleAndroidWebhook(
    @Body() body: Body & IAndroidSubscriptionWebhook,
  ): Promise<any> {
    return this.subscriptionService.handleAndroidWebhook(body);
  }

  @Post('/ios')
  async handleIosWebhook(
    @Body() body: Body & IosSubscriptionWebhookInterface,
  ): Promise<any> {
    return this.subscriptionService.handleIosWebhook(body);
  }
}
