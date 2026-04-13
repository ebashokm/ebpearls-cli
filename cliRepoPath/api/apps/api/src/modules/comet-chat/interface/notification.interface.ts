import { CometChatNotificationType } from '../enum/notification.enum';

/**
 * ${1:Description placeholder}
 *
 * @export
 * @interface CometChatPushPayload
 * @typedef {CometChatPushPayload}
 */
export interface CometChatPushPayload {
  /**
   * ${1:Description placeholder}
   *
   * @type {{
   *     type: CometChatNotificationType.COMET_CHAT_MESSAGE_SENT;
   *     receiverId: string;
   *     senderId: string;
   *     senderAvatar: string;
   *   }\}
   */
  [CometChatNotificationType.COMET_CHAT_MESSAGE_SENT]: {
    type: CometChatNotificationType.COMET_CHAT_MESSAGE_SENT;
    receiverId: string;
    senderId: string;
    senderAvatar: string;
  };
}
