import { Field, ObjectType } from '@nestjs/graphql';

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class ResetPWOtpVerificationResponse
 * @typedef {ResetPWOtpVerificationResponse}
 */
@ObjectType()
export class ResetPWOtpVerificationResponse {
  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field()
  userId: string;

  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field()
  token: string;
}
