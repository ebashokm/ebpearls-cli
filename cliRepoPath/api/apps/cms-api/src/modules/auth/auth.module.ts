import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { AdminModule } from '../admin/admin.module';
import { providers } from './providers';
import { PassportModule } from '@nestjs/passport';
import { mongooseModels } from './mongoose.models';
import { EmailTemplateModule } from '../email-template/email-template.module';
import { AwsModule } from '@app/common/services/s3/aws.module';
import { CsrfController } from './csrf.controller';

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class AuthModule
 * @typedef {AuthModule}
 */
@Module({
  imports: [
    AdminModule,
    ConfigModule,
    PassportModule,
    EmailTemplateModule,
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('ACCESS_TOKEN_SECRET'),
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature(mongooseModels),
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
  ],

  providers: providers,
  exports: [AuthModule],
  controllers: [CsrfController],
})
export class AuthModule {}
