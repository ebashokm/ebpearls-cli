import { Module } from '@nestjs/common';
import { FeedRepliesService } from './feed-replies.service';
import { FeedRepliesResolver } from './feed-replies.resolver';
import { UsersModule } from '../users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import {
  FeedReply,
  FeedReplySchema,
  FeedReplyRepository,
  FeedCommentRepository,
  PostLikeRepository,
  FeedComment,
  FeedCommentSchema,
  PostLike,
  PostLikeSchema,
  FeedRepository,
  Feed,
  FeedSchema,
} from '@app/data-access';

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class FeedRepliesModule
 * @typedef {FeedRepliesModule}
 */
@Module({
  imports: [
    UsersModule,
    MongooseModule.forFeature([
      {
        name: FeedReply.name,
        schema: FeedReplySchema,
      },
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
    ]),
  ],
  providers: [
    FeedRepliesResolver,
    FeedRepliesService,
    FeedReplyRepository,
    FeedCommentRepository,
    FeedRepository,
    PostLikeRepository,
  ],
  exports: [FeedRepliesService],
})
export class FeedRepliesModule {}
