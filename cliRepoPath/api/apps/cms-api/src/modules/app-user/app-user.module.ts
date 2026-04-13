import { Module } from '@nestjs/common';

import { MongooseModule } from '@nestjs/mongoose';
import { HttpModule } from '@nestjs/axios';
import { AuthModule } from '../auth/auth.module';
import { models } from './mongooseModel';
import { providers } from './provider';
import { ConfigService } from '@nestjs/config';
import { EmailTemplateModule } from '../email-template/email-template.module';
import { AwsModule } from '@app/common/services/s3/aws.module';
import { EventsController } from '@app/common/services/sse/events.controller';

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class AppUserModule
 * @typedef {AppUserModule}
 */
@Module({
  imports: [
    MongooseModule.forFeature(models),
    AwsModule.registerAsync({
      useFactory: async (configService: ConfigService) => {
        return {
          accessKeyId: configService.get('AWS_SES_ACCESS_KEY'),
          secretAccessKey: configService.get('AWS_SES_SECRET_KEY'),
          appEnv: configService.get('APP_ENV'),
          region: configService.get('AWS_SES_REGION'),
          apiVersion: configService.get('AWS_SES_API_VERSION'),
          sesFrom: configService.get('AWS_SES_FROM'),
        };
      },
      inject: [ConfigService],
    }),
    HttpModule,
    AuthModule,
    EmailTemplateModule,
  ],

  providers: providers,
  controllers: [EventsController],
})
export class AppUserModule {}
