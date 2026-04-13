import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { CommentAssetType } from './enum/comment-asset.enum';
import * as mongoose from 'mongoose';

export type FeedReplyDocument = FeedReply & mongoose.Document;

class ReplyAssets {
  type: CommentAssetType;
  url: string;
}

@Schema({ timestamps: true, autoIndex: true })
export class FeedReply {
  _id: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'FeedComment',
    required: true,
  })
  commentId: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Feed',
  })
  feedId: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  })
  postedBy: string;

  @Prop()
  replyText: string;

  @Prop({ type: ReplyAssets })
  assets: ReplyAssets;

  @Prop()
  likeCount: number;

  createdAt: Date;
  updatedAt: Date;

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop({ default: null })
  deletedAt: Date;
}

export const FeedReplySchema = SchemaFactory.createForClass(FeedReply);

FeedReplySchema.index(
  { commentId: 1, deletedAt: 1, createdAt: -1 },
  { name: 'feedreplies_comment_deleted_created', background: true },
);

FeedReplySchema.index(
  { postedBy: 1, deletedAt: 1, createdAt: -1 },
  { name: 'feedreplies_user_deleted_created', background: true },
);
