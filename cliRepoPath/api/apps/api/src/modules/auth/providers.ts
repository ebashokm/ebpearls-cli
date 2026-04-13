import {
  DeviceInfoRepository,
  UsersRepository,
  OTPRequestRepository,
  UserTokenMetaRepository,
  UpdatePhoneNumberRepository,
  PushNotificationTokenRepository,
  EmailTemplateRepository,
  DisposableEmailRepository,
  LoginInfoRepository,
} from '@app/data-access';
import { JwtTokenService } from '@app/authentication';

/**
 * Resolvers
 */
import { AuthResolver } from './auth.resolver';

/**
 * Services
 */
import { AuthService } from './services/auth.service';
import { PhoneOtpAuthService } from './services/phone-otp-auth.service';

/**
 * Strategy
 */
import { JwtStrategy } from './strategy/jwt.strategy';
import { S3Service } from '@app/common/services/s3';
import { ConfigService } from '@nestjs/config';
import { IsValidEmailConstraint } from '@app/common/decorators/disposable-email.decorator';
import { CometChatHelperService } from '@app/common/helpers/comet-chat.helper';
import { EmailService } from '@app/email/email.service';
import { AgoraHelperService } from '@app/common/services/voip/agora/agora.helper';
import { AwsSNSService } from '@app/common/services/sns';

/**
 * ${1:Description placeholder}
 *
 * @type {any[]}
 */
export const providers = [
  /**
   * Import resolvers
   */
  AuthResolver,

  /***
   * Import services
   */
  AuthService,
  AwsSNSService,
  JwtTokenService,
  PhoneOtpAuthService,
  JwtStrategy,
  S3Service,
  ConfigService,
  EmailService,
  IsValidEmailConstraint,
  CometChatHelperService,
  AgoraHelperService,
  /**
   * Import repo
   */
  DeviceInfoRepository,
  PushNotificationTokenRepository,
  OTPRequestRepository,
  UsersRepository,
  UserTokenMetaRepository,
  UpdatePhoneNumberRepository,
  EmailTemplateRepository,
  DisposableEmailRepository,
  LoginInfoRepository,
];
