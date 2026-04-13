import { Module } from '@nestjs/common';
import { ConfigurableModuleClass } from './inapp-module-definition';
import { InappSubscriptionService } from './inapp-subscription.service';

@Module({
  imports: [],
  providers: [InappSubscriptionService],
  exports: [InappSubscriptionService],
})
export class InappSubscriptionModule extends ConfigurableModuleClass {}
