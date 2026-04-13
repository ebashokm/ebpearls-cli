import { Injectable } from '@nestjs/common';
import { PushNotificationTokenRepository } from '@app/data-access';
import { CometChatPushPayload } from './interface/notification.interface';
import { CometChatNotificationType } from './enum/notification.enum';
import { FcmService } from '@app/fcm';

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class CometChatService
 * @typedef {CometChatService}
 */
@Injectable()
export class CometChatService {
  /**
   * Creates an instance of CometChatService.
   *
   * @constructor
   * @param {FcmService} fcmService
   * @param {PushNotificationTokenRepository} pushNotificationTokenRepo
   */
  constructor(
    private readonly fcmService: FcmService,
    private readonly pushNotificationTokenRepo: PushNotificationTokenRepository,
  ) {}

  /**
   * @description handle the comet chat webhook events
   * @param {Body & ICometChatWebhookPayload} body webhook payload object
   */
  async handleCometChatWebhook(body: Body) {
    // webhook payload format
    // {
    //   trigger: 'after_message',
    //   data: {
    //     id: '23',
    //     muid: '_rpuk0f155',
    //     conversationId: '65ae3a1ccfc92d2fe84a7573_user_superhero3',
    //     sender: '65ae3a1ccfc92d2fe84a7573',
    //     receiverType: 'user',
    //     receiver: 'superhero3',
    //     category: 'message', // 'action' in case of delete
    //     type: 'text', // 'text' | 'image' | 'file' | 'audio' | 'video'. Note: 'message' in case of delete
    //     data: {
    //       text: 'dfgfgfgf',
    //       action: 'deleted', // only in case of delete
    //       resource: 'WEB-4_0_3-298573ef-6d08-42cf-818d-888bf6ed6801-1706154089735',
    //       entities: [Object],
    //       metadata: [Object] // no metadata in case of delete
    //     },
    //     sentAt: 1706161199,
    //     updatedAt: 1706161199
    //   },
    //   appId: '2512009223c8786c',
    //   origin: { platform: 'API' },
    //   chatAPIVersion: '3.0',
    //   region: 'in',
    //   webhook: 'message-send'
    // }
    const trigger = body['trigger'];
    const data = body['data'];
    const appId = body['appId'];
    if (appId !== process.env.COMET_CHAT_APP_ID) {
      throw new Error('AppId does not match');
    }
    switch (trigger) {
      case 'after_connection_status_changed':
        break;
      case 'before_message':
        break;
      case 'after_message': {
        // note: triggers after message deletion as well
        const {
          category,
          receiver: receiverUid,
          sender: senderUid,
          type: messageDataType,
          data: messageData,
        } = data;

        if (category === 'message') {
          // send push notifications to users on message sendings
          const senderName = messageData?.entities?.sender?.entity?.name;
          const senderAvatar = messageData?.entities?.sender?.entity?.avatar;
          const messageDescription =
            messageDataType === 'text' ? messageData?.text : messageData?.url;
          await this.messageSentOnComet(receiverUid, senderName, messageDescription, {
            type: CometChatNotificationType.COMET_CHAT_MESSAGE_SENT,
            receiverId: receiverUid,
            senderId: senderUid,
            senderAvatar,
          });
        }
        break;
      }
      case 'message_delivery_receipt':
        break;
      case 'message_read_receipt':
        break;
    }
  }

  /**
   * Send push notification to the user for the comet chat conversation
   * @param {string[]} senderId - message sender id
   * @param {string} receiver - message receiver name
   * @param {PushNotificationData<PushNotificationType.COMMENT_ON_FEED>['data']} data - data to be sent in the push notification
   * @returns
   */
  async messageSentOnComet(
    receiverId: string,
    senderName: string,
    messageDescription: string,
    data: CometChatPushPayload[CometChatNotificationType.COMET_CHAT_MESSAGE_SENT],
  ) {
    const pushTokens = await this.pushNotificationTokenRepo.getPushTokensByUserId(receiverId);
    return this.fcmService.sendPushNotifications(pushTokens, {
      title: senderName,
      body: messageDescription,
      data,
    });
  }
}
