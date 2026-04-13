import {
  AdminRepository,
  DeviceInfoRepository,
  EmailTemplateRepository,
  LoginInfoRepository,
  OTPRequestRepository,
  SettingsRepository,
  TokenRepository,
  BusinessRepository,
} from '@app/data-access';
import { ConfigService } from '@nestjs/config';

/* custom services */
import { TokenService } from '../admin/service/token.service';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './service/auth.service';
import { HashService } from './service/hash.service';
import { JwtService } from './service/jwt.service';
import { JwtStrategy } from './strategy/jwt.strategy';
import { LocalStrategy } from './strategy/local.strategy';
import { OtpService } from './service/otp.service';
import { SettingService } from '../settings/settings.service';
import { EmailService } from '@app/email/email.service';
import { SesService } from '@app/email/ses.service';
import { S3Service } from '@app/common/services/s3';

/**
 * ${1:Description placeholder}
 *
 * @type {any[]}
 */
export const providers = [
  /* resolvers */
  AuthResolver,

  /* services */
  AuthService,
  JwtService,
  ConfigService,
  LocalStrategy,
  JwtStrategy,
  TokenService,
  SesService,
  S3Service,
  EmailService,
  HashService,
  OtpService,
  SettingService,
  AdminRepository,
  TokenRepository,
  OTPRequestRepository,
  DeviceInfoRepository,
  SettingsRepository,
  EmailTemplateRepository,
  BusinessRepository,
  LoginInfoRepository,
];
