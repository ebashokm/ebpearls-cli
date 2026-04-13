import { MessageResponse } from '@app/common/dto/response/message.response';
import { Resolver } from '@nestjs/graphql';
import { CronService } from './services/cron.service';

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class CronResolver
 * @typedef {CronResolver}
 */
@Resolver(() => MessageResponse)
export class CronResolver {
  /**
   * Creates an instance of CronResolver.
   *
   * @constructor
   * @param {CronService} cron
   */
  constructor(private readonly cron: CronService) {}
}
