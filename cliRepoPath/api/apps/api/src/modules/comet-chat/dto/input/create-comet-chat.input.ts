import { InputType, Int, Field, PartialType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class CreateCometChatGroupInput
 * @typedef {CreateCometChatGroupInput}
 */
@InputType()
export class CreateCometChatGroupInput {
  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field()
  @IsNotEmpty()
  propertyOwnerId: string;

  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field()
  @IsNotEmpty()
  propertyId: string;

  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field()
  @IsNotEmpty()
  guid: string;
}

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class UpdateCometChatGroupInput
 * @typedef {UpdateCometChatGroupInput}
 * @extends {PartialType(
 *   CreateCometChatGroupInput,
 * )}
 */
@InputType()
export class UpdateCometChatGroupInput extends PartialType(
  CreateCometChatGroupInput,
) {
  /**
   * ${1:Description placeholder}
   *
   * @type {number}
   */
  @Field(() => Int)
  id: number;
}
