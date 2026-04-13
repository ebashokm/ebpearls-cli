import { BaseEntityResponse } from '@app/common/dto/response/base-entity.response';
import { BasePaginationResponse } from '@app/common/dto/response/base-pagination.response';
import { Field, ObjectType } from '@nestjs/graphql';
import { UserProfileResponse } from '@api/common/dto/user.response';
import { FeedAssetType } from '@app/data-access/feed/enum/feed-asset.enum';
import { VisibilityType } from '@app/data-access/feed/enum/visibility-type.enum';
import { FeedStatus } from '@app/data-access/feed/enum/feed-status.enum';
import { LocationResponse } from '@app/common/dto/response/address.response';

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class FeedAsset
 * @typedef {FeedAsset}
 */
@ObjectType()
export class FeedAsset {
  /**
   * ${1:Description placeholder}
   *
   * @type {FeedAssetType}
   */
  @Field(() => FeedAssetType, { nullable: true })
  type: FeedAssetType;

  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field({ nullable: true })
  url: string;

  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field(() => [String], { nullable: true })
  thumbnails?: string[];
}

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class FeedEntity
 * @typedef {FeedEntity}
 * @extends {BaseEntityResponse}
 */
@ObjectType()
export class FeedEntity extends BaseEntityResponse {
  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field({ nullable: true })
  caption: string;

  /**
   * ${1:Description placeholder}
   *
   * @type {FeedAsset[]}
   */
  @Field(() => [FeedAsset], { nullable: true })
  assets: FeedAsset[];

  /**
   * ${1:Description placeholder}
   *
   * @type {LocationResponse}
   */
  @Field(() => LocationResponse, { nullable: true })
  location: LocationResponse;

  /**
   * ${1:Description placeholder}
   *
   * @type {FeedStatus}
   */
  @Field(() => FeedStatus, { nullable: true })
  status: FeedStatus;

  /**
   * ${1:Description placeholder}
   *
   * @type {Date}
   */
  @Field({ nullable: true })
  publishedDate: Date;

  /**
   * ${1:Description placeholder}
   *
   * @type {VisibilityType}
   */
  @Field(() => VisibilityType, { nullable: true })
  visibilityType: VisibilityType;

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
  commentCount: number;

  /**
   * ${1:Description placeholder}
   *
   * @type {number}
   */
  @Field({ nullable: true, defaultValue: 0 })
  shareCount: number;

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
   * @type {string}
   */
  @Field({ nullable: true })
  userId: string;

  /**
   * ${1:Description placeholder}
   *
   * @type {?UserProfileResponse}
   */
  @Field(() => UserProfileResponse, { nullable: true })
  userDetail?: UserProfileResponse;
}

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class FeedResponse
 * @typedef {FeedResponse}
 */
@ObjectType()
export class FeedResponse {
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
   * @type {?FeedEntity}
   */
  @Field(() => FeedEntity, { nullable: true })
  feed?: FeedEntity;

  /**
   * ${1:Description placeholder}
   *
   * @type {?FeedEntity[]}
   */
  @Field(() => [FeedEntity], { nullable: true })
  feeds?: FeedEntity[];

  /**
   * ${1:Description placeholder}
   *
   * @type {?BasePaginationResponse}
   */
  @Field(() => BasePaginationResponse, { nullable: true })
  pagination?: BasePaginationResponse;
}
