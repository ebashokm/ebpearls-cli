import { CreateBusinessUserInput } from './create-business-user.input';
import { InputType, Field, PartialType } from '@nestjs/graphql';

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class UpdateBusinessUserInput
 * @typedef {UpdateBusinessUserInput}
 * @extends {PartialType(
 *   CreateBusinessUserInput,
 * )}
 */
@InputType()
export class UpdateBusinessUserInput extends PartialType(CreateBusinessUserInput) {
  /**
   * Business ID
   *
   * @type {string}
   */
  @Field()
  id: string;
}
