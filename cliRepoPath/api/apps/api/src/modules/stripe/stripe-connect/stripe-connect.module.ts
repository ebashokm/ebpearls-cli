import { S3Service } from '@app/common/services/s3';
import {
  Business,
  BusinessRepository,
  BusinessSchema,
  UpdatePhoneNumber,
  UpdatePhoneNumberRepository,
  UpdatePhoneNumberSchema,
  User,
  UserSchema,
  UsersRepository,
} from '@app/data-access';
import { StripeService } from '@app/stripe';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { StripeConnectWebhookController } from './controller/stripe-connect-webhook.controller';
import { StripeConnectResolver } from './stripe-connect.resolver';
import { StripeConnectService } from './stripe-connect.service';
import { StripeWebhookService } from './stripe-webhook.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Business.name, schema: BusinessSchema },
      { name: User.name, schema: UserSchema },
      { name: UpdatePhoneNumber.name, schema: UpdatePhoneNumberSchema },
    ]),
  ],
  providers: [
    StripeConnectResolver,
    StripeConnectService,
    StripeService,
    BusinessRepository,
    UsersRepository,
    ConfigService,
    S3Service,
    UpdatePhoneNumberRepository,
    StripeWebhookService,
  ],
  controllers: [StripeConnectWebhookController],
})
export class StripeConnectModule {}
