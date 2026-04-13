import { BaseEntityResponse } from '@app/common/dto/response/base-entity.response';
import { BaseResponse } from '@app/common/dto/response/base-response.dto';
import { ObjectType, Field } from '@nestjs/graphql';

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class PriceResponse
 * @typedef {PriceResponse}
 */
@ObjectType()
export class PriceResponse {
  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field()
  priceId: string;

  /**
   * ${1:Description placeholder}
   *
   * @type {number}
   */
  @Field()
  price: number;

  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field({ nullable: true })
  name: string;

  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field({ nullable: true })
  currency: string;

  /**
   * ${1:Description placeholder}
   *
   * @type {boolean}
   */
  @Field({ nullable: true })
  isActive: boolean;
}
/**
 * ${1:Description placeholder}
 *
 * @export
 * @class SubsProductResponse
 * @typedef {SubsProductResponse}
 * @extends {BaseEntityResponse}
 */
@ObjectType()
export class SubsProductResponse extends BaseEntityResponse {
  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field()
  name: string;

  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field()
  productId: string;

  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field({ nullable: true })
  description: string;

  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field({ nullable: true })
  billingCycle: string;

  /**
   * ${1:Description placeholder}
   *
   * @type {boolean}
   */
  @Field({ nullable: true })
  isActive: boolean;

  /**
   * ${1:Description placeholder}
   *
   * @type {PriceResponse[]}
   */
  @Field(() => [PriceResponse], { nullable: true })
  prices: PriceResponse[];
}

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class SubscriptionProductResponse
 * @typedef {SubscriptionProductResponse}
 */
@ObjectType()
export class SubscriptionProductResponse {
  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field({ nullable: true })
  message: string;

  /**
   * ${1:Description placeholder}
   *
   * @type {SubsProductResponse}
   */
  @Field()
  data: SubsProductResponse;
}

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class PaginatedSubscriptionProductResponse
 * @typedef {PaginatedSubscriptionProductResponse}
 * @extends {BaseResponse}
 */
@ObjectType()
export class PaginatedSubscriptionProductResponse extends BaseResponse {
  /**
   * ${1:Description placeholder}
   *
   * @type {SubsProductResponse[]}
   */
  @Field(() => [SubsProductResponse], { nullable: true })
  data: SubsProductResponse[];
}
