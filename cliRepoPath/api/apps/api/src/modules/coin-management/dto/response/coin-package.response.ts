import { BaseEntityResponse } from '@app/common/dto/response/base-entity.response';
import { Field, ObjectType } from '@nestjs/graphql';

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class CoinPackageResponse
 * @typedef {CoinPackageResponse}
 * @extends {BaseEntityResponse}
 */
@ObjectType()
export class CoinPackageResponse extends BaseEntityResponse {
  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field()
  numberOfCoins: string;

  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field({ nullable: true })
  icon: string;

  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field({ nullable: true })
  appleProductId: string;

  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field({ nullable: true })
  androidProductId: string;
}
