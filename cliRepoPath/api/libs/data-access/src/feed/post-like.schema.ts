import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

/**
 * PostLikeDocument extends the PostLike class and includes Mongoose Document properties.
 *
 * @type {PostLikeDocument}
 */
export type PostLikeDocument = PostLike & mongoose.Document;

/**
 * Defines the types of posts that can be liked.
 *
 * @type {PostType}
 */
type PostType = 'feed' | 'comment' | 'reply';

/**
 * The PostLike schema represents the structure for storing likes associated with a post.
 * This includes information about the post being liked, the type of the post, and the users who liked it.
 */
@Schema({ timestamps: true, autoIndex: true })
export class PostLike {
  /**
   * Optional unique identifier for the like.
   *
   * @type {string}
   */
  _id?: string;

  /**
   * The unique identifier of the post that is being liked.
   * This field is required to associate the like with a specific post.
   *
   * @type {string}
   */
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  })
  postId: string;

  /**
   * The type of the post being liked.
   * It can be one of the following: 'feed', 'comment', or 'reply'.
   * This helps to categorize the post and understand the context of the like.
   *
   * @type {PostType}
   */
  @Prop({ type: String, enum: ['feed', 'comment', 'reply'] })
  postType: PostType;

  /**
   * An array of user IDs who liked the post.
   * This field is required to track which users have interacted with the post.
   *
   * @type {string[]}
   */
  @Prop({
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'User',
    required: true,
  })
  likedBy: string[];

  /**
   * The date and time when the like was created.
   * This is automatically managed by Mongoose using timestamps.
   *
   * @type {string}
   */
  createdAt?: string;

  /**
   * The date and time when the like was last updated.
   * This is automatically managed by Mongoose using timestamps.
   *
   * @type {string}
   */
  updatedAt?: string;

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop({ default: null })
  deletedAt: Date;
}

/**
 * The Mongoose schema for the PostLike class, defining the structure
 * of the documents in the postLikes collection of the database.
 */
export const PostLikeSchema = SchemaFactory.createForClass(PostLike);

PostLikeSchema.index(
  { postId: 1, postType: 1, likedBy: 1 },
  { name: 'postlikes_post_type_likedby', background: true },
);

PostLikeSchema.index(
  { likedBy: 1, postType: 1, createdAt: -1 },
  { name: 'postlikes_user_posts', background: true },
);
