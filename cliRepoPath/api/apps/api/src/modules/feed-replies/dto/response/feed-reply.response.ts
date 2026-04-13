import { BaseEntityResponse } from '@app/common/dto/response/base-entity.response';
import { Field, ObjectType } from '@nestjs/graphql';
import { UserProfileResponse } from '@api/common/dto/user.response';
import { BasePaginationResponse } from '@app/common/dto/response/base-pagination.response';
import { CommentAssetType } from '@app/data-access/feed/enum/comment-asset.enum';

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class ReplyAssets
 * @typedef {ReplyAssets}
 */
@ObjectType()
export class ReplyAssets {
  /**
   * ${1:Description placeholder}
   *
   * @type {CommentAssetType}
   */
  @Field(() => CommentAssetType, { nullable: true })
  type: CommentAssetType;

  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field({ nullable: true })
  url: string;
}

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class FeedReplyEntity
 * @typedef {FeedReplyEntity}
 * @extends {BaseEntityResponse}
 */
@ObjectType()
export class FeedReplyEntity extends BaseEntityResponse {
  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field()
  commentId: string;

  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field({ nullable: true })
  replyText: string;

  /**
   * ${1:Description placeholder}
   *
   * @type {ReplyAssets}
   */
  @Field(() => ReplyAssets, { nullable: true })
  assets: ReplyAssets;

  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field({ nullable: true })
  postedBy: string;

  /**
   * ${1:Description placeholder}
   *
   * @type {?UserProfileResponse}
   */
  @Field(() => UserProfileResponse, { nullable: true })
  userDetail?: UserProfileResponse;

  /**
   * ${1:Description placeholder}
   *
   * @type {?boolean}
   */
  @Field({ nullable: true, defaultValue: false })
  isLiked?: boolean;

  /**
   * ${1:Description placeholder}
   *
   * @type {number}
   */
  @Field({ nullable: true, defaultValue: 0 })
  likeCount: number;
}

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class FeedReplyResponse
 * @typedef {FeedReplyResponse}
 */
@ObjectType()
export class FeedReplyResponse {
  /**
   * ${1:Description placeholder}
   *
   * @type {?string}
   */
  @Field({ nullable: true })
  message?: string;

  /**
   * ${1:Description placeholder}
   *
   * @type {?FeedReplyEntity}
   */
  @Field(() => FeedReplyEntity, { nullable: true })
  feedReply?: FeedReplyEntity;

  /**
   * ${1:Description placeholder}
   *
   * @type {?FeedReplyEntity[]}
   */
  @Field(() => [FeedReplyEntity], { nullable: true })
  feedReplies?: FeedReplyEntity[];

  /**
   * ${1:Description placeholder}
   *
   * @type {?BasePaginationResponse}
   */
  @Field(() => BasePaginationResponse, { nullable: true })
  pagination?: BasePaginationResponse;
}
