import { UsersModule } from '@api/modules/users/users.module';
import { AuthenticationModule } from '@app/authentication';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { StripeRedirectController } from '../stripe-connect/controller/stripe-redirect.controller';
import { StripePaymentWebhookController } from './controller/stripe-webhook.controller';
import { mongooseModels } from './mongoose.models';
import { providers } from './providers';
import { StripePaymentService } from './services/stripe-payment.service';

/**
 * Description placeholder
 *
 * @export
 * @class StripePaymentModule
 * @typedef {StripePaymentModule}
 */
@Module({
  imports: [
    JwtModule,
    AuthenticationModule,
    UsersModule,
    MongooseModule.forFeature(mongooseModels),
  ],
  providers: providers,
  controllers: [StripePaymentWebhookController, StripeRedirectController],
  exports: [StripePaymentService],
})
export class StripePaymentModule {}
