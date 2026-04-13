import { Module } from '@nestjs/common';
import { FeedsService } from './feeds.service';
import { FeedsResolver } from './feeds.resolver';
import { MongooseModule } from '@nestjs/mongoose';

import {
  PushNotificationToken,
  PushNotificationTokenRepository,
  PushNotificationTokenSchema,
  FeedReply,
  FeedReplySchema,
  FeedReplyRepository,
  PostLikeRepository,
  FeedRepository,
  Feed,
  FeedSchema,
  PostLike,
  PostLikeSchema,
  FeedCommentRepository,
  FeedComment,
  FeedCommentSchema,
} from '@app/data-access';
import { FeedCommentsService } from '../feed-comments/feed-comments.service';
import { UsersModule } from '../users/users.module';
import { S3Service } from '@app/common/services/s3';
import { ConfigService } from '@nestjs/config';
import { FeedCommentNotificationHandler } from '../feed-comments/handler/notification.handler';
import { NotificationsModule } from '../notifications/notifications.module';
import { FcmService } from '@app/fcm';

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class FeedsModule
 * @typedef {FeedsModule}
 */
@Module({
  imports: [
    UsersModule,
    NotificationsModule,
    MongooseModule.forFeature([
      {
        name: Feed.name,
        schema: FeedSchema,
      },
      {
        name: FeedComment.name,
        schema: FeedCommentSchema,
      },
      {
        name: FeedReply.name,
        schema: FeedReplySchema,
      },
      {
        name: PostLike.name,
        schema: PostLikeSchema,
      },
      {
        name: PushNotificationToken.name,
        schema: PushNotificationTokenSchema,
      },
    ]),
  ],
  providers: [
    FeedsResolver,
    FeedsService,
    FeedCommentsService,
    FeedCommentNotificationHandler,
    FeedCommentRepository,
    FeedRepository,
    PostLikeRepository,
    FeedReplyRepository,
    PushNotificationTokenRepository,
    S3Service,
    FcmService,
    ConfigService,
  ],
  exports: [FeedsService],
})
export class FeedsModule {}
