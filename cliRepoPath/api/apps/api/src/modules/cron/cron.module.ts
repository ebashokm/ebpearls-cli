import { Module } from '@nestjs/common';
import { CronService } from './services/cron.service';
import { CronResolver } from './cron.resolver';
import {
  DisposableEmail,
  DisposableEmailRepository,
  DisposableEmailSchema,
} from '@app/data-access';
import { MongooseModule } from '@nestjs/mongoose';
import { DisposableEmailService } from './services/disposable-email.service';
import { StripePaymentModule } from '../stripe/stripe-payment/stripe-payment.module';

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class CronModule
 * @typedef {CronModule}
 * @implements {OnModuleInit}
 */
@Module({
  imports: [
    StripePaymentModule,
    MongooseModule.forFeature([
      {
        name: DisposableEmail.name,
        schema: DisposableEmailSchema,
      },
    ]),
  ],
  providers: [CronResolver, CronService, DisposableEmailService, DisposableEmailRepository],
})
export class CronModule {}
