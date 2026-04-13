import { UsersRepository, TokenRepository, EmailTemplateRepository } from '@app/data-access';
import { TokenService } from '../admin/service/token.service';
import { HashService } from '../auth/service/hash.service';
import { AppUserResolver } from './app-user.resolver';
import { AppUserService } from './app-user.service';
import { CometChatHelperService } from '@app/common/helpers/comet-chat.helper';
import { EmailService } from '@app/email/email.service';
import { LocationService } from '@app/common/services/google/location.service';
import { EventsService } from '@app/common/services/sse/events.service';
import { EventsController } from '@app/common/services/sse/events.controller';
import { UserEventsService } from '@app/common/services/sse/user.events.service';
/**
 * ${1:Description placeholder}
 *
 * @type {any[]}
 */
export const providers = [
  AppUserResolver,
  AppUserService,
  LocationService,
  HashService,
  EmailService,
  TokenService,
  CometChatHelperService,
  UsersRepository,
  TokenRepository,
  EmailTemplateRepository,
  EventsController,
  EventsService,
  UserEventsService,
];
