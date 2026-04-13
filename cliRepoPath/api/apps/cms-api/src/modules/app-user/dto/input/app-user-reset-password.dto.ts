import { Field, InputType } from '@nestjs/graphql';
import { IsEmail } from 'class-validator';

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class AppUserResetPasswordDTO
 * @typedef {AppUserResetPasswordDTO}
 */
@InputType()
export class AppUserResetPasswordDTO {
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

  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field()
  password: string;
}

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class ResetPasswordOtpVerificationDTO
 * @typedef {ResetPasswordOtpVerificationDTO}
 */
@InputType()
export class ResetPasswordOtpVerificationDTO {
  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field()
  email: string;
  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field()
  otp: string;
}

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class ForgotPasswordDTO
 * @typedef {ForgotPasswordDTO}
 */
@InputType()
export class ForgotPasswordDTO {
  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field()
  @IsEmail()
  email: string;

  /**
   * ${1:Description placeholder}
   *
   * @type {?string}
   */
  @Field({ nullable: true })
  deviceId?: string;
}
