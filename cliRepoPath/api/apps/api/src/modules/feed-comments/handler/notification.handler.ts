import { Injectable } from '@nestjs/common';
import { NotificationsService } from '@api/modules/notifications/notifications.service';
import {
  FeedCommentNotificationThemeAttributes,
  FeedCommentPushPayload,
} from '../interface/notification.interface';
import { PushNotificationTokenRepository } from '@app/data-access';
import { FeedCommentNotificationType } from '@app/data-access/feed/enum/notification.enum';
import { FcmService } from '@app/fcm';

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class FeedCommentNotificationHandler
 * @typedef {FeedCommentNotificationHandler}
 */
@Injectable()
export class FeedCommentNotificationHandler {
  /**
   * Creates an instance of FeedCommentNotificationHandler.
   *
   * @constructor
   * @param {NotificationsService} notificationsService
   * @param {FcmService} fcmService
   * @param {PushNotificationTokenRepository} pushNotificationTokenRepo
   */
  constructor(
    private readonly notificationsService: NotificationsService,
    private readonly fcmService: FcmService,
    private readonly pushNotificationTokenRepo: PushNotificationTokenRepository,
  ) {}

  /**
   * @param {string} userId user to send notification for
   * @param {string} commentorName commentor name
   * @param themeAttributes theme attributes
   * @returns
   */
  async commentedOnFeed(
    userId: string,
    commentorName: string,
    themeAttributes: FeedCommentNotificationThemeAttributes[FeedCommentNotificationType.COMMENT_ON_FEED],
  ) {
    const description = `${commentorName} has commented on your feed`;
    return this.notificationsService.create(userId, {
      theme: FeedCommentNotificationType.COMMENT_ON_FEED,
      description,
      themeAttributes,
    });
  }

  /**
   * Send push notification to the feed owner when the comment is added
   * @param {string[]} ownerId - feed owner id
   * @param {string} commentorName - commentor's name
   * @param {PushNotificationData<PushNotificationType.COMMENT_ON_FEED>['data']} data - data to be sent in the push notification
   * @returns
   */
  async addPushOnCommentedOnFeed(
    userId: string,
    commentorName: string,
    data: FeedCommentPushPayload[FeedCommentNotificationType.COMMENT_ON_FEED],
  ) {
    const pushTokens = await this.pushNotificationTokenRepo.getPushTokensByUserId(userId);

    return this.fcmService.sendPushNotifications(pushTokens, {
      title: `Feed comment`,
      body: `${commentorName} has commented on your feed`,
      data,
    });
  }
}
