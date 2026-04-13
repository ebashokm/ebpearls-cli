import { Resolver, Query, Args } from '@nestjs/graphql';
import { NotificationsService } from './notifications.service';
import {
  NotificationResponse,
  PaginatedNotifications,
} from './dto/response/notification.response';
import { UseGuards } from '@nestjs/common';
import { AuthUserGuard } from '@api/guards/auth.user.guard';
import { LoginDetail } from '../auth/decorator/login.decorator';
import { ListNotificationsInput } from './dto/input/list-notifications.input';
import { TermsGuard } from '@api/guards/terms.guard';

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class NotificationsResolver
 * @typedef {NotificationsResolver}
 */
@Resolver(() => NotificationResponse)
@UseGuards(AuthUserGuard, TermsGuard)
export class NotificationsResolver {
  /**
   * Creates an instance of NotificationsResolver.
   *
   * @constructor
   * @param {NotificationsService} notificationsService
   */
  constructor(private readonly notificationsService: NotificationsService) {}

  /**
   * ${1:Description placeholder}
   *
   * @async
   * @param {*} loginDetail
   * @param {ListNotificationsInput} input
   * @returns {Promise<any>}
   */
  @Query(() => PaginatedNotifications)
  async listUserNotifications(
    @LoginDetail() loginDetail,
    @Args('input') input: ListNotificationsInput,
  ) {
    return this.notificationsService.findAll(loginDetail.userId, input);
  }
}
