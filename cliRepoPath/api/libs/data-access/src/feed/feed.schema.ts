import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { FeedStatus } from './enum/feed-status.enum';
import { VisibilityType } from './enum/visibility-type.enum';
import * as mongoose from 'mongoose';
import { FeedAssetType } from './enum/feed-asset.enum';
import { LocationResponse } from '@app/common/dto/response/address.response';

class FeedAsset {
  type: FeedAssetType;
  url: string;
}

export type FeedDocument = Feed & mongoose.Document;

@Schema({ timestamps: true, autoIndex: true })
export class Feed {
  _id: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  })
  userId: string;

  @Prop()
  caption: string;

  @Prop()
  assets: FeedAsset[];

  @Prop()
  location: LocationResponse;

  @Prop({
    required: true,
    enum: FeedStatus,
    default: FeedStatus.DRAFT,
    type: String,
  })
  status: FeedStatus;

  @Prop({ default: null })
  publishedDate: Date;

  @Prop({ type: String, enum: VisibilityType })
  visibilityType: VisibilityType;

  @Prop()
  likeCount: number;

  @Prop()
  commentCount: number;

  @Prop()
  shareCount: number;

  createdAt: Date;
  updatedAt: Date;

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop({ default: null })
  deletedAt: Date;
}

export const FeedSchema = SchemaFactory.createForClass(Feed);

FeedSchema.index(
  { status: 1, deletedAt: 1, visibilityType: 1, publishedDate: -1 },
  { name: 'feeds_status_deleted_visibility_published', background: true },
);

FeedSchema.index(
  { caption: 'text', 'location.city': 'text' },
  { name: 'feeds_text_search', background: true },
);

FeedSchema.index(
  { userId: 1, status: 1, publishedDate: -1 },
  { name: 'feeds_user_status_published', background: true },
);

FeedSchema.index({ 'assets.url': 1 }, { name: 'feeds_assets_url', background: true });
