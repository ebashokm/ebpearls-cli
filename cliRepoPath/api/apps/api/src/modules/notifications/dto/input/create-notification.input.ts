import { InputType, Int, Field } from '@nestjs/graphql';

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class CreateNotificationInput
 * @typedef {CreateNotificationInput}
 */
@InputType()
export class CreateNotificationInput {
  /**
   * ${1:Description placeholder}
   *
   * @type {number}
   */
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
