import { Module } from '@nestjs/common';
import { PaypalSubscriptionResolver } from './paypal-subscription.resolver';
import { PaypalSubscriptionService } from './paypal-subscription.service';

@Module({
  providers: [PaypalSubscriptionResolver, PaypalSubscriptionService],
})
export class PaypalSubscriptionModule {}
