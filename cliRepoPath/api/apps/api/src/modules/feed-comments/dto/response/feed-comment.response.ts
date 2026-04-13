import { BaseEntityResponse } from '@app/common/dto/response/base-entity.response';
import { BasePaginationResponse } from '@app/common/dto/response/base-pagination.response';
import { Field, ObjectType } from '@nestjs/graphql';
import { UserProfileResponse } from '@api/common/dto/user.response';
import { CommentAssetType } from '@app/data-access/feed/enum/comment-asset.enum';
/**
 * ${1:Description placeholder}
 *
 * @export
 * @class CommentAssets
 * @typedef {CommentAssets}
 */
@ObjectType()
export class CommentAssets {
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
 * @class FeedCommentEntity
 * @typedef {FeedCommentEntity}
 * @extends {BaseEntityResponse}
 */
@ObjectType()
export class FeedCommentEntity extends BaseEntityResponse {
  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field()
  feedId: string;

  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field({ nullable: true })
  commentText: string;

  /**
   * ${1:Description placeholder}
   *
   * @type {CommentAssets}
   */
  @Field(() => CommentAssets, { nullable: true })
  assets: CommentAssets;

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

  /**
   * ${1:Description placeholder}
   *
   * @type {number}
   */
  @Field({ nullable: true, defaultValue: 0 })
  replyCount: number;
}

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class FeedCommentResponse
 * @typedef {FeedCommentResponse}
 */
@ObjectType()
export class FeedCommentResponse {
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
   * @type {?FeedCommentEntity}
   */
  @Field(() => FeedCommentEntity, { nullable: true })
  feedComment?: FeedCommentEntity;

  /**
   * ${1:Description placeholder}
   *
   * @type {?FeedCommentEntity[]}
   */
  @Field(() => [FeedCommentEntity], { nullable: true })
  feedComments?: FeedCommentEntity[];

  /**
   * ${1:Description placeholder}
   *
   * @type {?BasePaginationResponse}
   */
  @Field(() => BasePaginationResponse, { nullable: true })
  pagination?: BasePaginationResponse;
}
