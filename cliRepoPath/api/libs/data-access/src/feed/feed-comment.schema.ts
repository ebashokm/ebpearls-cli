import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { CommentAssetType } from './enum/comment-asset.enum';
import * as mongoose from 'mongoose';

class CommentAssets {
  type: CommentAssetType;
  url: string;
}

export type FeedCommentDocument = FeedComment & mongoose.Document;

@Schema({ timestamps: true, autoIndex: true })
export class FeedComment {
  _id: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Feed',
    required: true,
  })
  feedId: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  })
  postedBy: string;

  @Prop()
  commentText: string;

  @Prop({ type: CommentAssets })
  assets: CommentAssets;

  @Prop()
  likeCount: number;

  @Prop()
  replyCount: number;

  createdAt: Date;
  updatedAt: Date;

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop({ default: null })
  deletedAt: Date;
}

export const FeedCommentSchema = SchemaFactory.createForClass(FeedComment);

FeedCommentSchema.index(
  { feedId: 1, deletedAt: 1, createdAt: -1 },
  { name: 'feedcomments_feed_deleted_created', background: true },
);

FeedCommentSchema.index(
  { postedBy: 1, deletedAt: 1, createdAt: -1 },
  { name: 'feedcomments_user_deleted_created', background: true },
);
