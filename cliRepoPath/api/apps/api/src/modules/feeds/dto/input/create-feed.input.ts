import { InputType, Field } from '@nestjs/graphql';

import { CoordinatesInput } from '@api/modules/auth/dto/input/common/address.input';
import { LocationType } from '@app/common/enum/location-type.enum';
import { FeedAssetType } from '@app/data-access/feed/enum/feed-asset.enum';
import { FeedStatus } from '@app/data-access/feed/enum/feed-status.enum';
import { VisibilityType } from '@app/data-access/feed/enum/visibility-type.enum';
import { optional } from 'joi';
import { IsOptional } from 'class-validator';

/**
 * ${1:Description placeholder}
 *
 * @class FeedAssetInput
 * @typedef {FeedAssetInput}
 */
@InputType()
class FeedAssetInput {
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
}

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class LocationInput
 * @typedef {LocationInput}
 */
@InputType()
export class LocationInput {
  /**
   * ${1:Description placeholder}
   *
   * @type {LocationType}
   */
  @Field(() => LocationType)
  type: LocationType;
  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field({ nullable: true })
  displayAddress: string;
  /**
   * ${1:Description placeholder}
   *
   * @type {CoordinatesInput}
   */
  @Field(() => CoordinatesInput, { nullable: true })
  coordinates: CoordinatesInput;
  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field({ nullable: true })
  country: string;
  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field({ nullable: true })
  state: string;
  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field({ nullable: true })
  city: string;
  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field({ nullable: true })
  street: string;
  /**
   * ${1:Description placeholder}
   *
   * @type {number}
   */
  @Field({ nullable: true })
  postalCode: string;
}
/**
 * ${1:Description placeholder}
 *
 * @export
 * @class CreateFeedInput
 * @typedef {CreateFeedInput}
 */
@InputType()
export class CreateFeedInput {
  /**
   * ${1:Description placeholder}
   *
   * @type {?string}
   */
  @Field({ nullable: true })
  @IsOptional()
  caption?: string;

  /**
   * ${1:Description placeholder}
   *
   * @type {?FeedAssetInput[]}
   */
  @Field(() => [FeedAssetInput], { nullable: true })
  @IsOptional()
  assets?: FeedAssetInput[];

  /**
   * ${1:Description placeholder}
   *
   * @type {?LocationInput}
   */
  @Field(() => LocationInput, { nullable: true })
  @IsOptional()
  location?: LocationInput;

  /**
   * ${1:Description placeholder}
   *
   * @type {?FeedStatus}
   */
  @Field(() => FeedStatus, { nullable: true, defaultValue: FeedStatus.DRAFT })
  @IsOptional()
  status?: FeedStatus;

  /**
   * ${1:Description placeholder}
   *
   * @type {?VisibilityType}
   */
  @Field(() => VisibilityType, {
    nullable: true,
    defaultValue: VisibilityType.PUBLIC,
  })
  @IsOptional()
  visibilityType?: VisibilityType;
}
