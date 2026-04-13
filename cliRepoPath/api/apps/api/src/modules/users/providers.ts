import {
  DeviceInfoRepository,
  OTPRequestRepository,
  PushNotificationTokenRepository,
  TokenRepository,
  UserTokenMetaRepository,
  UsersRepository,
  PageRepository,
} from '@app/data-access';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';
import { S3Service } from '@app/common/services/s3/s3.service';
import { ConfigService } from '@nestjs/config';
import { FcmService } from '@app/fcm';
import { AgoraHelperService } from '@app/common/services/voip/agora/agora.helper';

/**
 * ${1:Description placeholder}
 *
 * @type {any[]}
 */
export const providers = [
  UsersResolver,
  UsersService,
  S3Service,
  AgoraHelperService,
  FcmService,
  ConfigService,
  UsersRepository,
  TokenRepository,
  OTPRequestRepository,
  UserTokenMetaRepository,
  DeviceInfoRepository,
  PushNotificationTokenRepository,
  PageRepository,
];
