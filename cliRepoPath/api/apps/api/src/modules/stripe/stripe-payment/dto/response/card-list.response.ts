import { ObjectType, Field } from '@nestjs/graphql';

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class CardListReponse
 * @typedef {CardListReponse}
 */
@ObjectType()
export class CardListReponse {
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
   * @type {string}
   */
  @Field({ nullable: true })
  cardId: string;
  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field({ nullable: true })
  brand: string;
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
   * @type {number}
   */
  @Field({ nullable: true })
  exp_month: number;
  /**
   * ${1:Description placeholder}
   *
   * @type {number}
   */
  @Field({ nullable: true })
  exp_year: number;
  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field({ nullable: true })
  fingerprint: string;
  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field({ nullable: true })
  funding: string;
  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field({ nullable: true })
  last4: string;
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
   * @type {boolean}
   */
  @Field({ nullable: true })
  is_default_source: boolean;
}
