import { FeedCommentNotificationType } from '@app/data-access/feed/enum/notification.enum';

/**
 * ${1:Description placeholder}
 *
 * @interface AddCommentAttributes
 * @typedef {AddCommentAttributes}
 */
interface AddCommentAttributes {
  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  commentorId: string;
  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  feedId: string;
}

/**
 * ${1:Description placeholder}
 *
 * @export
 * @interface FeedCommentNotificationThemeAttributes
 * @typedef {FeedCommentNotificationThemeAttributes}
 */
export interface FeedCommentNotificationThemeAttributes {
  /**
   * ${1:Description placeholder}
   *
   * @type {AddCommentAttributes}
   */
  [FeedCommentNotificationType.COMMENT_ON_FEED]: AddCommentAttributes;
}

/**
 * ${1:Description placeholder}
 *
 * @export
 * @interface FeedCommentPushPayload
 * @typedef {FeedCommentPushPayload}
 */
export interface FeedCommentPushPayload {
  /**
   * ${1:Description placeholder}
   *
   * @type {{
   *     type: FeedCommentNotificationType.COMMENT_ON_FEED;
   *     feedId: string;
   *     commentorId: string;
   *   }\}
   */
  [FeedCommentNotificationType.COMMENT_ON_FEED]: {
    type: FeedCommentNotificationType.COMMENT_ON_FEED;
    feedId: string;
    commentorId: string;
  };
}
