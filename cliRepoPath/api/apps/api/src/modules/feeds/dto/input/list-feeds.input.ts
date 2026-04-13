import { Field, InputType } from '@nestjs/graphql';
import { Transform } from 'class-transformer';
import { toMongoObjectId } from '@app/common/helpers/mongo-helper';
import { IsNumber, IsOptional, IsPositive, IsString, Min } from 'class-validator';
import { BasePaginationParams } from '@api/common/dto/base-pagination.dto';
import { FeedStatus } from '@app/data-access/feed/enum/feed-status.enum';

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class ListFeedsInput
 * @typedef {ListFeedsInput}
 * @extends {BasePaginationParams}
 */
@InputType()
export class ListFeedsInput extends BasePaginationParams {
  /**
   * ${1:Description placeholder}
   *
   * @type {?string}
   */
  @Field({ nullable: true, defaultValue: 'publishedDate' })
  @IsString()
  @IsOptional()
  orderBy?: string;

  /**
   * ${1:Description placeholder}
   *
   * @type {?string}
   */
  @Field({ nullable: true, defaultValue: 'desc' })
  @IsString()
  @IsOptional()
  order?: string;

  /**
   * ${1:Description placeholder}
   *
   * @type {boolean}
   */
  @Field({ nullable: true, defaultValue: false })
  @IsOptional()
  isArchived: boolean;

  /**
   * ${1:Description placeholder}
   *
   * @type {FeedStatus}
   */
  @Field(() => FeedStatus, {
    nullable: true,
  })
  @IsOptional()
  status: FeedStatus;

  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field({ nullable: true })
  @Transform(toMongoObjectId)
  @IsOptional()
  ownerId: string;
}

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class ListCommentsInFeedInput
 * @typedef {ListCommentsInFeedInput}
 */
@InputType()
export class ListCommentsInFeedInput {
  /**
   * ${1:Description placeholder}
   *
   * @type {?string}
   */
  @Field({ nullable: true, defaultValue: 'desc' })
  @IsOptional()
  order?: string;

  /**
   * ${1:Description placeholder}
   *
   * @type {?string}
   */
  @Field({ nullable: true, defaultValue: '_id' })
  @IsOptional()
  orderBy?: string;

  /**
   * ${1:Description placeholder}
   *
   * @type {?number}
   */
  @IsPositive()
  @IsNumber()
  @Field({ defaultValue: 2 })
  @IsOptional()
  limit?: number;

  /**
   * ${1:Description placeholder}
   *
   * @type {?number}
   */
  @Min(0)
  @IsNumber()
  @Field({ defaultValue: 0 })
  @IsOptional()
  skip?: number;
}

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class ListRepliesInFeedInput
 * @typedef {ListRepliesInFeedInput}
 * @extends {ListCommentsInFeedInput}
 */
@InputType()
export class ListRepliesInFeedInput extends ListCommentsInFeedInput {
  /**
   * ${1:Description placeholder}
   *
   * @type {?number}
   */
  @IsPositive()
  @IsNumber()
  @Field({ defaultValue: 1 })
  @IsOptional()
  limit?: number;
}
