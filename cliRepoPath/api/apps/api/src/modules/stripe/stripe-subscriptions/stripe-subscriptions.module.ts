import { Module } from '@nestjs/common';
import { StripeSubscriptionService } from './stripe-subscriptions.service';
import { StripeSubscriptionResolver } from './stripe-subscriptions.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { StripeService } from '@app/stripe';
import {
  StripeCustomer,
  StripeCustomerRepository,
  StripeCustomerSchema,
  StripeSubscription,
  StripeSubscriptionRepository,
  User,
  UserSchema,
  StripeSubscriptionSchema,
  SubscriptionProductRepository,
  SubscriptionProduct,
  SubscriptionProductSchema,
} from '@app/data-access';
import { ConfigService } from '@nestjs/config';
import { S3Service } from '@app/common/services/s3';
import { StripeSubscriptionWebhookController } from './controller/stripe-subscription-webhook.controller';
import { StripeSubscriptionWebhookService } from './stripe-subscriptions-webhook.service';
import { UsersModule } from '@api/modules/users/users.module';
import { AuthModule } from '@api/modules/auth/auth.module';
/**
 * Description placeholder
 *
 * @export
 * @class StripeSubscriptionModule
 * @typedef {StripeSubscriptionModule}
 */
@Module({
  imports: [
    UsersModule,
    AuthModule,
    MongooseModule.forFeature([
      {
        name: StripeSubscription.name,
        schema: StripeSubscriptionSchema,
      },
      {
        name: User.name,
        schema: UserSchema,
      },
      {
        name: StripeCustomer.name,
        schema: StripeCustomerSchema,
      },
      {
        name: SubscriptionProduct.name,
        schema: SubscriptionProductSchema,
      },
    ]),
  ],
  providers: [
    StripeSubscriptionResolver,
    StripeSubscriptionService,
    StripeSubscriptionWebhookService,
    StripeService,
    ConfigService,
    S3Service,
    StripeSubscriptionRepository,
    SubscriptionProductRepository,
    StripeCustomerRepository,
  ],
  controllers: [StripeSubscriptionWebhookController],
  exports: [StripeSubscriptionService, StripeSubscriptionRepository],
})
export class StripeSubscriptionModule {}
