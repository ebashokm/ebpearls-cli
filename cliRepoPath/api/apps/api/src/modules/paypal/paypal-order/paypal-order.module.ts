import { Module } from '@nestjs/common';
import { PaypalOrderService } from './paypal-order.service';
import { PaypalOrderResolver } from './paypal-order.resolver';
import { PaypalCoreModule, PaypalCoreService } from '@app/paypal-core';
import { PaypalOrderRepository } from './repository';
import { MongooseModule } from '@nestjs/mongoose';
import { PaypalOrder, PaypalOrderSchema } from './model/paypal-order.schema';
import { Environment } from '@paypal/paypal-server-sdk';

@Module({
  imports: [
    PaypalCoreModule.registerAsync({
      useFactory: () => {
        return {
          oAuthClientId: process.env.PAYPAL_OAUTH_CLIENT_ID,
          oAuthClientSecret: process.env.PAYPAL_OAUTH_CLIENT_SECRET,
          environment:
            process.env.PAYPAL_ENVIRONMENT === 'production'
              ? Environment.Production
              : Environment.Sandbox,
          partnerAttributionId: process.env.PAYPAL_PARTNER_ATTRIBUTION_ID,
          merchantId: process.env.PAYPAL_MERCHANT_ID,
        };
      },
    }),
    MongooseModule.forFeature([
      {
        name: PaypalOrder.name,
        schema: PaypalOrderSchema,
      },
    ]),
  ],
  providers: [PaypalOrderResolver, PaypalOrderService, PaypalOrderRepository],
})
export class PaypalOrderModule {}
