import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';
/**
 * ${1:Description placeholder}
 *
 * @export
 * @class CreateStripeSubscriptionInput
 * @typedef {CreateStripeSubscriptionInput}
 */
@InputType()
export class CreateStripeSubscriptionInput {
  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field()
  @IsNotEmpty()
  productId: string;

  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field()
  @IsNotEmpty()
  priceId: string;

  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field()
  @IsNotEmpty()
  cardId: string;

  /**
   * ${1:Description placeholder}
   *
   * @type {?string}
   */
  @Field({ nullable: true })
  couponCode?: string;
}
