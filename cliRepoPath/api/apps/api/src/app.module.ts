import './instrument';
import '@app/common/plugins/audit-fields'; //attach audit fields to schemas
import '@app/common/plugins/audit-log'; //attach audit log to schemas

import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { EmailModule } from '@app/email/email.module';
import { RequestLoggerMiddleware } from '@app/winston-logger/index';
import { LoggerModule } from '@app/winston-logger/logger.module';
import { ExpressAdapter } from '@bull-board/express';
import { BullBoardModule } from '@bull-board/nestjs';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { BullModule } from '@nestjs/bullmq';
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { getConnectionToken, MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';
import { ServeStaticModule } from '@nestjs/serve-static';
import GraphQLJSON from 'graphql-type-json';
import {
  AcceptLanguageResolver,
  GraphQLWebsocketResolver,
  HeaderResolver,
  I18nModule,
  QueryResolver,
} from 'nestjs-i18n';
import * as path from 'path';
import { join } from 'path';
import { ConfigProvider } from './providers/config.provider';
import { CronProvider } from './providers/cron.provider';

//For controlling depth of graphql query
import depthLimit from 'graphql-depth-limit';

//For loggin memory used in endpoint
import { CustomThrottlerGuard } from '@app/common/guards/custom-throttler-guard';
import { MemoryInterceptor } from '@app/common/interceptors/memory.record.interceptor';
import { SecurityInterceptor } from '@app/common/interceptors/security.interceptor';
import { formatGraphQLError } from '@app/common/utils/error-handler.util';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ThrottlerModule } from '@nestjs/throttler';
import { ClsModule } from 'nestjs-cls';
import { UserContextInterceptor } from '@app/common/interceptors/user-context.interceptor';
import { SentryGlobalFilter, SentryModule } from '@sentry/nestjs/setup';
import { ClsPluginTransactional } from '@nestjs-cls/transactional';
import { TransactionalAdapterMongoose } from '@nestjs-cls/transactional-adapter-mongoose';
import mongoose from 'mongoose';

// __MODULE_IMPORTS__

@Module({
  imports: [
    SentryModule.forRoot(),
    // Enhanced throttling configuration
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 1000, // 1 second
        limit: 3, // 3 requests per second
      },
      {
        name: 'medium',
        ttl: 10000, // 10 seconds
        limit: 20, // 20 requests per 10 seconds
      },
      {
        name: 'long',
        ttl: 60000, // 1 minute
        limit: 100, // 100 requests per minute
      },
    ]),

    // Enhanced static file serving with security
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'docs/api'),
      serveRoot: '/api-docs',
      serveStaticOptions: {
        index: false, // Disable directory listing
        dotfiles: 'deny', // Deny access to dotfiles
        etag: true,
        lastModified: true,
        setHeaders: (res, path) => {
          // Security headers for static files
          res.setHeader('X-Content-Type-Options', 'nosniff');
          res.setHeader('X-Frame-Options', 'DENY');
        },
      },
    }),
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'docs/api'),
      serveRoot: '/api-docs',
      serveStaticOptions: {
        index: false,
        dotfiles: 'deny',
        etag: true,
        lastModified: true,
        setHeaders: (res, path) => {
          res.setHeader('X-Content-Type-Options', 'nosniff');
          res.setHeader('X-Frame-Options', 'DENY');
        },
      },
    }),
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'docs/combined'),
      serveRoot: '/docs',
      serveStaticOptions: {
        index: false,
        dotfiles: 'deny',
        etag: true,
        lastModified: true,
        setHeaders: (res, path) => {
          res.setHeader('X-Content-Type-Options', 'nosniff');
          res.setHeader('X-Frame-Options', 'DENY');
        },
      },
    }),

    // Enhanced Multer configuration with security
    MulterModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        dest: configService.get<string>('MULTER_UPLOAD_DEST'),
        limits: {
          fileSize: 10 * 1024 * 1024, // 10MB limit
          files: 5, // Maximum 5 files per request
        },
        fileFilter: (req, file, cb) => {
          // Security: Only allow specific file types
          const allowedMimes = [
            'image/jpeg',
            'image/png',
            'image/gif',
            'image/webp',
            'application/pdf',
            'text/plain',
          ];

          if (allowedMimes.includes(file.mimetype)) {
            cb(null, true);
          } else {
            cb(new Error('File type not allowed'), false);
          }
        },
      }),
    }),

    // Enhanced Bull configuration with Redis security
    BullModule.forRootAsync({
      useFactory: async (configService: ConfigService) => {
        return {
          connection: {
            host: configService.get<string>('REDIS_HOST'),
            port: configService.get<number>('REDIS_PORT'),
            password: configService.get<string>('REDIS_PASSWORD'),
            retryDelayOnFailover: 100,
            enableReadyCheck: false,
            maxRetriesPerRequest: null,
            lazyConnect: true,
          },
        };
      },
      inject: [ConfigService],
    }),

    // Enhanced Bull Board with authentication
    BullBoardModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        route: `${configService.get<string>('BULL_BOARD_PATH')}`,
        adapter: ExpressAdapter,
        middleware: [
          // Add basic auth for Bull Board
          (req, res, next) => {
            const auth = req.headers.authorization;
            const expectedAuth = `Basic ${Buffer.from(
              `${configService.get<string>('BULL_BOARD_USER')}:${configService.get<string>('BULL_BOARD_PASSWORD')}`,
            ).toString('base64')}`;

            if (auth === expectedAuth) {
              next();
            } else {
              res.setHeader('WWW-Authenticate', 'Basic realm="Bull Board"');
              res.status(401).send('Authentication required');
            }
          },
        ],
      }),
    }),

    /** providers */
    ConfigProvider,
    CronProvider,

    /** modules - dynamically injected by CLI */
    // __MODULE_REGISTRATIONS__

    // Enhanced I18n configuration
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loaderOptions: {
        path: path.join(__dirname, '/i18n/'),
        watch: true,
      },
      resolvers: [
        GraphQLWebsocketResolver,
        { use: QueryResolver, options: ['lang'] },
        new HeaderResolver(['x-lang']),
        AcceptLanguageResolver,
      ],
    }),

    // __GRAPHQL_MODULE__

    EmailModule.forRoot(),

    // Enhanced Mongoose configuration with security
    MongooseModule.forRootAsync({
      useFactory: async (configService: ConfigService) => {
        mongoose.set('transactionAsyncLocalStorage', true);
        return {
          uri: encodeURI(configService.get('DB_CONNECTION_STRING')),
          // Only pass supported MongoDB driver options for your Mongoose version
          maxPoolSize: 10,
          serverSelectionTimeoutMS: 5000,
          socketTimeoutMS: 45000,
        };
      },
      inject: [ConfigService],
    }),
    ClsModule.forRoot({
      global: true,
      middleware: { mount: true },
      plugins: [
        new ClsPluginTransactional({
          imports: [MongooseModule],
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
      provide: APP_INTERCEPTOR,
      useClass: SecurityInterceptor, // Add security interceptor
    },
    {
      provide: APP_GUARD,
      useClass: CustomThrottlerGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: UserContextInterceptor,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggerMiddleware).forRoutes('*'); // Apply to all routes
  }
}
