import { Field, InputType } from '@nestjs/graphql';
import { STRIPE_API_VERSION } from '@api/constants';

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class GetEphemeralKeyInput
 * @typedef {GetEphemeralKeyInput}
 */
@InputType()
export class GetEphemeralKeyInput {
  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field({ nullable: true, defaultValue: STRIPE_API_VERSION })
  apiVersion: string;
}
