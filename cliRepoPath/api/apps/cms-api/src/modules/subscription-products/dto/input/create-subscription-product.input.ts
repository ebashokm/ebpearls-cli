import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, Min } from 'class-validator';
import { BillingCycleEnum } from '../../enum/subscription-products.enum';

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class SubscriptionPrice
 * @typedef {SubscriptionPrice}
 */
@InputType()
export class SubscriptionPrice {
  /**
   * ${1:Description placeholder}
   *
   * @type {number}
   */
  @Field()
  @IsNotEmpty()
  @Min(1)
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
  @Field({ nullable: true, defaultValue: 'aud' })
  currency: string;

  /**
   * ${1:Description placeholder}
   *
   * @type {boolean}
   */
  @Field({ nullable: true, defaultValue: true })
  isActive: boolean;
}

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class CreateSubscriptionProductInput
 * @typedef {CreateSubscriptionProductInput}
 */
@InputType()
export class CreateSubscriptionProductInput {
  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field()
  @IsNotEmpty()
  productName: string;

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
   * @type {boolean}
   */
  @Field({ nullable: true, defaultValue: true })
  isActive: boolean;

  /**
   * ${1:Description placeholder}
   *
   * @type {BillingCycleEnum}
   */
  @Field(() => BillingCycleEnum, {
    nullable: true,
  })
  billingCycle: BillingCycleEnum;

  /**
   * ${1:Description placeholder}
   *
   * @type {SubscriptionPrice[]}
   */
  @Field(() => [SubscriptionPrice], { nullable: true })
  prices: SubscriptionPrice[];
}
