import { CreateNotificationInput } from './create-notification.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class UpdateNotificationInput
 * @typedef {UpdateNotificationInput}
 * @extends {PartialType(
 *   CreateNotificationInput,
 * )}
 */
@InputType()
export class UpdateNotificationInput extends PartialType(
  CreateNotificationInput,
) {
  /**
   * ${1:Description placeholder}
   *
   * @type {number}
   */
  @Field(() => Int)
  id: number;
}
