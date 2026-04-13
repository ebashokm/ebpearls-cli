import { BaseEntityResponse } from '@app/common/dto/response/base-entity.response';
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
}

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class SubscriptionProductResponse
 * @typedef {SubscriptionProductResponse}
 * @extends {BaseEntityResponse}
 */
@ObjectType()
export class SubscriptionProductResponse extends BaseEntityResponse {
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
   * @type {PriceResponse[]}
   */
  @Field(() => [PriceResponse])
  prices: PriceResponse[];
}
