import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { AuthenticationModule } from '@app/authentication';
import { mongooseModels } from './mongoose.models';
import { providers } from './providers';
import { controllers } from './controllers';
import { AuthService } from './services/auth.service';
import { OtpModule } from '@app/otp/otp.module';
import { AwsModule } from '@app/common/services/s3/aws.module';
import { SocialAuthModule } from '@app/social-auth';
import { HttpModule } from '@nestjs/axios';

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class AuthModule
 * @typedef {AuthModule}
 */
@Module({
  imports: [
    HttpModule,
    AuthenticationModule,
    SocialAuthModule.registerAsync({
      useFactory: () => {
        return {
          appleClientId: process.env.APPLE_CLIENT_ID.split(','),
          facebookClientSecret: process.env.FACEBOOK_APP_SECRET,
          googleClientId: process.env.GOOGLE_CLIENT_ID.split(','),
          tiktokClientKey: process.env.TIKTOK_CLIENT_KEY,
          tiktokClientSecret: process.env.TIKTOK_CLIENT_SECRET,
          facebookScopes: ['id', 'name', 'first_name', 'last_name', 'email'],
        };
      },
    }),

    JwtModule.registerAsync({
      useFactory: () => {
        return {
          secret: process.env.JWT_REFRESH_TOKEN_SECRET,
        };
      },
    }),
    OtpModule.registerAsync({
      useFactory: () => {
        return {
          accountSid: process.env.OTP_TWILIO_ACCOUNT_SID,
          authToken: process.env.OTP_TWILIO_AUTH_TOKEN,
          twilioNumber: process.env.OTP_TWILIO_PHONE_NUMBER,
          accessKeyId: process.env.OTP_AWS_SNS_ACCESS_KEY,
          secretAccessKey: process.env.OTP_AWS_SNS_SECRET_KEY,
          region: process.env.OTP_AWS_SNS_REGION,
          apiVersion: process.env.OTP_AWS_SNS_API_VERSION,
        };
      },
    }),
    AwsModule.registerAsync({
      useFactory: () => {
        return {
          accessKeyId: process.env.AWS_SES_ACCESS_KEY,
          secretAccessKey: process.env.AWS_SES_SECRET_KEY,
          region: process.env.AWS_SES_REGION,
          apiVersion: process.env.AWS_SES_API_VERSION,
          sesFrom: process.env.AWS_SES_FROM,
          appEnv: process.env.APP_ENV,
        };
      },
    }),
    MongooseModule.forFeature(mongooseModels),
  ],
  providers: providers,
  exports: [AuthService],
  controllers: controllers,
})
export class AuthModule {}
