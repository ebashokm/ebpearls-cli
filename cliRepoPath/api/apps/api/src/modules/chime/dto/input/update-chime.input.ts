import { InputType, Field, Int } from '@nestjs/graphql';

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class UpdateChimeInput
 * @typedef {UpdateChimeInput}
 */
@InputType()
export class UpdateChimeInput {
  /**
   * ${1:Description placeholder}
   *
   * @type {number}
   */
  @Field(() => Int)
  id: number;
}
