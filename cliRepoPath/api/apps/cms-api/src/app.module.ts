import './instrument';
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getConnectionToken, MongooseModule } from '@nestjs/mongoose';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { DataAccessModule } from '@app/data-access';
import { configValidationSchema } from './config/config.schema';
import { EmailModule } from '@app/email/email.module';
import {
  AcceptLanguageResolver,
  GraphQLWebsocketResolver,
  I18nModule,
  QueryResolver,
} from 'nestjs-i18n';
import * as path from 'path';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { LoggerModule } from '@app/winston-logger/logger.module';
import { RequestLoggerMiddleware } from '@app/winston-logger/index';
import depthLimit from 'graphql-depth-limit';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { MemoryInterceptor } from '@app/common/interceptors/memory.record.interceptor';
import { CustomThrottlerGuard } from '@app/common/guards/custom-throttler-guard';
import { ThrottlerModule } from '@nestjs/throttler';
import { formatGraphQLError } from '@app/common/utils/error-handler.util';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { RedisCacheModule } from '@app/graphql-redis-cache';
import { SentryGlobalFilter, SentryModule } from '@sentry/nestjs/setup';
import { ClsModule } from 'nestjs-cls';
import { ClsPluginTransactional } from '@nestjs-cls/transactional';
import { TransactionalAdapterMongoose } from '@nestjs-cls/transactional-adapter-mongoose';
import mongoose from 'mongoose';

// __MODULE_IMPORTS__

@Module({
  imports: [
    SentryModule.forRoot(),
    RedisCacheModule,
    ThrottlerModule.forRoot([
      {
        ttl: 2000,
        limit: 3,
      },
    ]),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './apps/cms-api/.env',
      validationSchema: configValidationSchema,
    }),
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loaderOptions: {
        path: path.join(__dirname, '/i18n/'),
        watch: true,
      },
      resolvers: [
        GraphQLWebsocketResolver,
        { use: QueryResolver, options: ['lang'] },
        AcceptLanguageResolver,
      ],
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      context: ({ req, res }) => ({ req, res }),
      validationRules: [depthLimit(5)],
      driver: ApolloDriver,
      autoSchemaFile: true,
      path: '/cms-api',
      playground: false,
      introspection: true,
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
      formatError: formatGraphQLError,
    }),
    EventEmitterModule.forRoot(),

    DataAccessModule,
    LoggerModule,

    // __MODULE_REGISTRATIONS__

    MongooseModule.forRootAsync({
      useFactory: async (configService: ConfigService) => {
        mongoose.set('transactionAsyncLocalStorage', true);
        return {
          uri: encodeURI(configService.get('DB_CONNECTION_STRING')),
          maxPoolSize: 10,
          serverSelectionTimeoutMS: 5000,
          socketTimeoutMS: 45000,
        };
      },
      inject: [ConfigService],
    }),
    EmailModule.forRoot(),
    ClsModule.forRoot({
      global: true,
      middleware: { mount: true },
      plugins: [
        new ClsPluginTransactional({
          adapter: new TransactionalAdapterMongoose({
            mongooseConnectionToken: getConnectionToken(),
          }),
        }),
      ],
    }),
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: SentryGlobalFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: MemoryInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: CustomThrottlerGuard,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggerMiddleware).forRoutes('*');
  }
}
