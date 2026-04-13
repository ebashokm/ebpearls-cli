import { ObjectType, Field } from '@nestjs/graphql';
import { BaseEntityResponse } from '@app/common/dto/response/base-entity.response';
import { StripeSubscriptionStatus } from '@app/common/enum/stripe-subscription.enum';

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class SubscriptionObjectDto
 * @typedef {SubscriptionObjectDto}
 */
@ObjectType()
export class SubscriptionObjectDto {
  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field()
  subscriptionId: string;

  /**
   * ${1:Description placeholder}
   *
   * @type {Date}
   */
  @Field({ nullable: true })
  subscriptionStart: Date;

  /**
   * ${1:Description placeholder}
   *
   * @type {Date}
   */
  @Field({ nullable: true })
  subscriptionEnd: Date;

  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field({ nullable: true })
  latestInvoice: string;

  /**
   * ${1:Description placeholder}
   *
   * @type {number}
   */
  @Field({ nullable: true })
  subscriptionAmount: number;

  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field({ nullable: true })
  subscriptionCurrency: string;

  /**
   * ${1:Description placeholder}
   *
   * @type {boolean}
   */
  @Field({ nullable: true, defaultValue: false })
  isTrial: boolean;
}

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class StripeSubscriptionResponse
 * @typedef {StripeSubscriptionResponse}
 * @extends {BaseEntityResponse}
 */
@ObjectType()
export class StripeSubscriptionResponse extends BaseEntityResponse {
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
  @Field()
  priceId: string;

  /**
   * ${1:Description placeholder}
   *
   * @type {StripeSubscriptionStatus}
   */
  @Field(() => StripeSubscriptionStatus)
  status: StripeSubscriptionStatus;

  /**
   * ${1:Description placeholder}
   *
   * @type {SubscriptionObjectDto}
   */
  @Field(() => SubscriptionObjectDto, { nullable: true })
  subscriptionObject: SubscriptionObjectDto;
}
