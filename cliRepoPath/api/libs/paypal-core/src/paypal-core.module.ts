import { Module } from '@nestjs/common';
import { PaypalCoreService } from './paypal-core.service';
import { ConfigurableModuleClass } from './paypal.definition';

@Module({
  providers: [PaypalCoreService],
  exports: [PaypalCoreService],
})
export class PaypalCoreModule extends ConfigurableModuleClass {}
