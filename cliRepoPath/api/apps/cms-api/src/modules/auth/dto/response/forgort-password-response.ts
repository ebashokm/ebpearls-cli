import { Field, ObjectType } from '@nestjs/graphql';

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class ForgotPasswordResponse
 * @typedef {ForgotPasswordResponse}
 */
@ObjectType()
export class ForgotPasswordResponse {
  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field()
  message: string;
}
