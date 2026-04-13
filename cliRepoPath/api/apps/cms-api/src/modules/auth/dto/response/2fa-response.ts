import { Field, ObjectType, PickType } from '@nestjs/graphql';
import { AdminLoginResponse } from './auth-response';

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class ResendOtpCodeResponse
 * @typedef {ResendOtpCodeResponse}
 * @extends {PickType(AdminLoginResponse, [
 *   'expiresAt',
 *   'expiresBy',
 * ] as const)}
 */
@ObjectType()
export class ResendOtpCodeResponse extends PickType(AdminLoginResponse, [
  'expiresAt',
  'expiresBy',
] as const) {}

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class AuthUrlResponse
 * @typedef {AuthUrlResponse}
 */
@ObjectType()
export class AuthUrlResponse {
  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field(() => String, { nullable: true })
  base32: string;

  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field(() => String, { nullable: true })
  otpAuthUrl: string;
}

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class VerifyAuthOtpResponse
 * @typedef {VerifyAuthOtpResponse}
 * @extends {PickType(AdminLoginResponse, [
 *   'message',
 * ] as const)}
 */
@ObjectType()
export class VerifyAuthOtpResponse extends PickType(AdminLoginResponse, [
  'message',
] as const) {}
