import { registerEnumType } from '@nestjs/graphql';

/**
 * ${1:Description placeholder}
 *
 * @export
 * @enum {number}
 */
export enum CometChatNotificationType {
  COMET_CHAT_MESSAGE_SENT = 'COMET_CHAT_MESSAGE_SENT',
  // other types
}

registerEnumType(CometChatNotificationType, {
  name: 'CometChatNotificationType',
});
