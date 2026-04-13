import { registerEnumType } from '@nestjs/graphql';

/**
 * ${1:Description placeholder}
 *
 * @export
 * @enum {number}
 */
export enum FeedCommentNotificationType {
  COMMENT_ON_FEED = 'COMMENT_ON_FEED',
  // other types
}

registerEnumType(FeedCommentNotificationType, {
  name: 'FeedCommentNotificationType',
});
