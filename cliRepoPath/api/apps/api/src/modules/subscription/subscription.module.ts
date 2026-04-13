import { Module } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { SubscriptionResolver } from './subscription.resolver';
import { JwtModule } from '@nestjs/jwt';
import { AuthenticationModule } from '@app/authentication';
import { MongooseModule } from '@nestjs/mongoose';
import { mongooseModels } from './mongoose-models';
import {
  UserSubscriptionRepository,
  UsersRepository,
  SubscriptionLogRepository,
} from '@app/data-access';
import { SubscriptionWebhookController } from './controller/subscription-webhook.controller';
import { InappSubscriptionModule } from '@app/inapp-subscription';
import { ENVIRONMENT } from './constants';

@Module({
  imports: [
    JwtModule,
    InappSubscriptionModule.registerAsync({
      useFactory: () => {
        return {
          iapMode: process.env.IAP_MODE || ENVIRONMENT.SANDBOX,
          iosSecret: process.env.IN_APP_IOS_SECRET,
          androidClientEmail: process.env.ANDROID_IAP_CLIENT_EMAIL,
          androidPrivateKey: process.env.ANDROID_IAP_PRIVATE_KEY,
        };
      },
    }),
    AuthenticationModule,
    MongooseModule.forFeature(mongooseModels),
  ],
  providers: [
    SubscriptionResolver,
    SubscriptionService,
    UsersRepository,
    UserSubscriptionRepository,
    SubscriptionLogRepository,
  ],
  controllers: [SubscriptionWebhookController],
  exports: [SubscriptionService],
})
export class SubscriptionModule {}
