import { Module } from '@nestjs/common';
import { FeedCommentsService } from './feed-comments.service';
import { FeedCommentsResolver } from './feed-comments.resolver';
import {
  PushNotificationToken,
  PushNotificationTokenRepository,
  PushNotificationTokenSchema,
  FeedCommentRepository,
  FeedComment,
  FeedCommentSchema,
  FeedRepository,
  Feed,
  FeedSchema,
  PostLikeRepository,
  PostLike,
  PostLikeSchema,
  FeedReplyRepository,
  FeedReply,
  FeedReplySchema,
} from '@app/data-access';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from '../users/users.module';
import { FeedRepliesService } from '../feed-replies/feed-replies.service';
import { ConfigService } from '@nestjs/config';
import { NotificationsModule } from '../notifications/notifications.module';
import { S3Service } from '@app/common/services/s3';
import { FeedCommentNotificationHandler } from './handler/notification.handler';
import { FcmService } from '@app/fcm';

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class FeedCommentsModule
 * @typedef {FeedCommentsModule}
 */
@Module({
  imports: [
    UsersModule,
    NotificationsModule,
    MongooseModule.forFeature([
      {
        name: FeedComment.name,
        schema: FeedCommentSchema,
      },
      {
        name: Feed.name,
        schema: FeedSchema,
      },
      {
        name: PostLike.name,
        schema: PostLikeSchema,
      },
      {
        name: FeedReply.name,
        schema: FeedReplySchema,
      },
      {
        name: PushNotificationToken.name,
        schema: PushNotificationTokenSchema,
      },
    ]),
  ],
  providers: [
    FeedCommentsResolver,
    FeedCommentsService,
    FeedRepliesService,
    FeedCommentNotificationHandler,
    FeedCommentRepository,
    FeedRepository,
    PostLikeRepository,
    FeedReplyRepository,
    PushNotificationTokenRepository,
    FcmService,
    ConfigService,
    S3Service,
  ],
  exports: [FeedCommentsService],
})
export class FeedCommentsModule {}
