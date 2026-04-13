import { BadRequestException, Injectable } from '@nestjs/common';
import { NotificationRepository } from '@app/data-access';
import { ListNotificationsInput } from './dto/input/list-notifications.input';
import { PaginatedNotifications } from './dto/response/notification.response';
import { NotificationInput } from './interface/notification.interface';
import { I18nService } from 'nestjs-i18n';

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class NotificationsService
 * @typedef {NotificationsService}
 */
@Injectable()
export class NotificationsService {
  /**
   * Creates an instance of NotificationsService.
   *
   * @constructor
   * @param {NotificationRepository} notificationRepository
   */
  constructor(
    private readonly notificationRepository: NotificationRepository,
    private readonly i18nService: I18nService,
  ) {}
  /**
   * Create notification
   * @param {string} userId user id to create notification for
   * @param body notification input - theme and themeAttributes in addition to others
   * @returns created notification
   */
  async create(userId: string, body: NotificationInput) {
    try {
      const createData = {
        ...body,
        userId,
        readAt: null,
        viewedAt: null,
      };
      return await this.notificationRepository.create(createData);
    } catch (e) {
      throw new BadRequestException(e?.message);
    }
  }

  /**
   * get unviewed notification list for user
   * @param userId user id to get notification of
   * @param input - { timestamp?: Date; page?: number, perPage?: number}
   * @returns
   */
  async findAll(userId: string, input: ListNotificationsInput): Promise<PaginatedNotifications> {
    const { timestamp, limit, skip } = input;
    try {
      const { data, pagination } = await this.notificationRepository.getAllByUserId(userId, {
        limit,
        skip,
        timestamp,
      });

      const viewedIds = [];

      const result = data?.map((notification) => {
        const { themeAttributes, ...rest } = notification.toObject();
        viewedIds.push(String(rest._id));
        return {
          ...rest,
          themeAttributes: {
            attributes: themeAttributes,
          },
        } as any;
        //} as NotificationResponse; needtoreview
      });

      if (viewedIds.length) {
        await this.notificationRepository.updateMany(
          { _id: { $in: viewedIds } },
          { viewedAt: new Date() },
        );
      }

      return {
        message: this.i18nService.t('notifications.notification_list'),
        notifications: result,
        pagination,
      };
    } catch (e) {
      throw new BadRequestException(e?.message);
    }
  }
}
