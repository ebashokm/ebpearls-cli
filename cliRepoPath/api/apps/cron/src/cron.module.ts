import './instrument';
import { Module, OnModuleInit } from '@nestjs/common';
import { CronController } from './cron.controller';
import { CronService } from './cron.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  DisposableEmail,
  DisposableEmailRepository,
  DisposableEmailSchema,
  StripeCustomer,
  StripeCustomerRepository,
  StripeCustomerSchema,
  User,
  UserSchema,
  UsersRepository,
} from '@app/data-access';
import { DisposableEmailService } from './services/disposable-email.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { StripePaymentService } from './services/stripe-payment.service';
import { StripeService } from '@app/stripe';
import { S3Service } from '@app/common/services/s3';
import {
  AcceptLanguageResolver,
  // GraphQLWebsocketResolver,
  I18nModule,
  QueryResolver,
} from 'nestjs-i18n';
import * as path from 'path';
import { SchedulerRegistry } from '@nestjs/schedule';
import { ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { CronSecurityGuard } from '@app/common/guards/cron-security.guard';
import { SentryModule } from '@sentry/nestjs/setup';

/**
 * Enhanced Cron Module with security measures
 */
@Module({
  imports: [
    SentryModule.forRoot(),
    // Enhanced throttling for cron operations
    ThrottlerModule.forRoot([
      {
        name: 'cron',
        ttl: 60000, // 1 minute
        limit: 10, // 10 cron operations per minute
      },
    ]),

    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './apps/cron/.env',
      // validationSchema: {
      //   DB_CONNECTION_STRING: { type: 'string', required: true },
      //   CRON_SECRET_KEY: { type: 'string', required: true },
      //   REDIS_HOST: { type: 'string', required: true },
      //   REDIS_PORT: { type: 'number', required: true },
      //   REDIS_PASSWORD: { type: 'string', required: true },
      // },
    }),

    MongooseModule.forFeature([
      {
        name: DisposableEmail.name,
        schema: DisposableEmailSchema,
      },
      {
        name: User.name,
        schema: UserSchema,
      },
      {
        name: StripeCustomer.name,
        schema: StripeCustomerSchema,
      },
    ]),

    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loaderOptions: {
        path: path.join(__dirname, '/i18n/'),
        watch: true,
      },
      resolvers: [
        //GraphQLWebsocketResolver,
        { use: QueryResolver, options: ['lang'] },
        AcceptLanguageResolver,
      ],
    }),

    // Enhanced Mongoose configuration with security
    MongooseModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        uri: encodeURI(configService.get('DB_CONNECTION_STRING')),
        maxPoolSize: 5,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 30000,
        retryWrites: true,
        retryReads: true,
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [CronController],
  providers: [
    CronService,
    DisposableEmailService,
    DisposableEmailRepository,
    StripeService,
    S3Service,
    UsersRepository,
    StripeCustomerRepository,
    StripePaymentService,
    SchedulerRegistry,
    {
      provide: APP_GUARD,
      useClass: CronSecurityGuard, // Add security guard for cron operations
    },
  ],
})
export class CronModule implements OnModuleInit {
  constructor(
    private readonly cronService: CronService,
    private readonly configService: ConfigService,
  ) {}

  public async onModuleInit() {
    // Validate cron secret key
    const cronSecret = this.configService.get<string>('CRON_SECRET_KEY');
    if (!cronSecret || cronSecret.length < 32) {
      throw new Error('CRON_SECRET_KEY must be at least 32 characters long');
    }

    console.log('🔒 Cron module initialized with security measures');
    this.cronService.cronTest();
  }
}
