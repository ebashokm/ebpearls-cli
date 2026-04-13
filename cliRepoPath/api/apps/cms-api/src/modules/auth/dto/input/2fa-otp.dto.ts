import { Field, InputType, PickType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, Matches } from 'class-validator';

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class OtpVerificationFor2FADTO
 * @typedef {OtpVerificationFor2FADTO}
 */
@InputType()
export class OtpVerificationFor2FADTO {
  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field()
  @IsNotEmpty()
  @Matches(/^\d{4}$/, { message: 'otp should be 4 digit' })
  otp: string;

  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field()
  @IsNotEmpty()
  deviceId: string;
}

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class Resend2FAOtpCodeDTO
 * @typedef {Resend2FAOtpCodeDTO}
 */
@InputType()
export class Resend2FAOtpCodeDTO {
  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field()
  @IsNotEmpty()
  deviceId: string;

  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field()
  @IsNotEmpty()
  deviceType: string;

  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field()
  @IsNotEmpty()
  deviceName: string;
}

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class validateAuthOTPInput
 * @typedef {ValidateAuthOTPInput}
 * @extends {PickType(OtpVerificationFor2FADTO, [
 *   'email',
 * ] as const)}
 */
@InputType()
export class ValidateAuthOTPInput extends PickType(OtpVerificationFor2FADTO, ['email'] as const) {
  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field()
  @IsNotEmpty()
  @Matches(/^\d{6}$/, { message: 'otp should be 6 digit' })
  otp: string;
}
