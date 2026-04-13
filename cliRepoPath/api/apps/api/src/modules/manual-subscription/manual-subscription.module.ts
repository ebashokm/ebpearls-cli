import { Module } from '@nestjs/common';
import { ManualSubscriptionService } from './manual-subscription.service';
import { ManualSubscriptionResolver } from './manual-subscription.resolver';
import { StripeService } from '@app/stripe';
import { User, UserSchema, UsersRepository } from '@app/data-access';
import { MongooseModule } from '@nestjs/mongoose';
import { PaypalCoreModule } from '@app/paypal-core/paypal-core.module';
import { Environment } from '@paypal/paypal-server-sdk';
import { ManualSubscriptionRepository } from './repository';
import { ManualSubscription, ManualSubscriptionSchema } from './model';
import { PaypalOrderRepository } from '../paypal/paypal-order/repository';
import { PaypalOrder, PaypalOrderSchema } from '../paypal/paypal-order/model/paypal-order.schema';
import {
  SubscriptionPlan,
  SubscriptionPlanRepository,
  SubscriptionPlanSchema,
} from '@app/data-access/subscription-plan';

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
        name: User.name,
        schema: UserSchema,
      },
      {
        name: ManualSubscription.name,
        schema: ManualSubscriptionSchema,
      },
      {
        name: PaypalOrder.name,
        schema: PaypalOrderSchema,
      },
      {
        name: SubscriptionPlan.name,
        schema: SubscriptionPlanSchema,
      },
    ]),
  ],
  providers: [
    ManualSubscriptionResolver,
    ManualSubscriptionService,
    StripeService,
    UsersRepository,
    ManualSubscriptionRepository,
    PaypalOrderRepository,
    SubscriptionPlanRepository,
  ],
})
export class ManualSubscriptionModule {}
