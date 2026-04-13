import { IsNotEmpty } from 'class-validator';
import { CreateSubscriptionProductInput } from './create-subscription-product.input';
import { InputType, Field, PartialType } from '@nestjs/graphql';

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class UpdateSubscriptionProductInput
 * @typedef {UpdateSubscriptionProductInput}
 * @extends {PartialType(
 *   CreateSubscriptionProductInput,
 * )}
 */
@InputType()
export class UpdateSubscriptionProductInput extends PartialType(CreateSubscriptionProductInput) {
  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field()
  @IsNotEmpty()
  // @Transform(toMongoObjectId)
  id: string;
}
