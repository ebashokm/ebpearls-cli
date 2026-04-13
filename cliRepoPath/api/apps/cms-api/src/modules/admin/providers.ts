import { AdminRepository, TokenRepository } from '@app/data-access';
import { AdminResolver } from './admin.resolver';
import { AdminService } from './service/admin.service';
import { S3Service } from '@app/common/services/s3';
import { TokenService } from './service/token.service';
import { UserEventsService } from '@app/common/services/sse/user.events.service';
import { EventsController } from '@app/common/services/sse/events.controller';
import { EventsService } from '@app/common/services/sse/events.service';

/**
 * ${1:Description placeholder}
 *
 * @type {any[]}
 */
export const providers = [
  /* resolvers */
  AdminResolver,

  /* services */
  AdminService,
  S3Service,

  /* repos */
  AdminRepository,
  TokenRepository,
  TokenService,
  UserEventsService,
  EventsService,
  EventsController,
];
