import { CreateStripeSubscriptionInput } from './create-stripe-subscription.input';
import { InputType, PartialType, OmitType, Field } from '@nestjs/graphql';
/**
 * ${1:Description placeholder}
 *
 * @export
 * @class UpdateStripeSubscriptionInput
 * @typedef {UpdateStripeSubscriptionInput}
 * @extends {PartialType(
 *   OmitType(CreateStripeSubscriptionInput, ['cardId'] as const),
 * )}
 */
@InputType()
export class UpdateStripeSubscriptionInput extends PartialType(
  OmitType(CreateStripeSubscriptionInput, ['cardId'] as const),
) {
  /**
   * ${1:Description placeholder}
   *
   * @type {?boolean}
   */
  @Field({ nullable: true, defaultValue: false })
  isUpgrade?: boolean;
}
