import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class CreateCardInput
 * @typedef {CreateCardInput}
 */
@InputType()
export class CreateCardInput {
  /**
   * ${1:Description placeholder}
   * Card token generated from stripe using Ephemeral Key. Must be called after getEphemeralKey API
   * @type {string}
   */
  @Field({
    description:
      'Card token generated from stripe using Ephemeral Key. Must be called after getEphemeralKey API',
  })
  @IsNotEmpty()
  card_token: string;
}
