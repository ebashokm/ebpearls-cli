import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, MinLength } from 'class-validator';
import { UpdatePhoneNumberInput } from './update-phone-number.input';

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class PhoneLoginWithOTPInput
 * @typedef {PhoneLoginWithOTPInput}
 * @extends {UpdatePhoneNumberInput}
 */
@InputType()
export class PhoneLoginWithOTPInput extends UpdatePhoneNumberInput {
  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field()
  @IsNotEmpty()
  @MinLength(5)
  deviceId: string;

  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field()
  @IsNotEmpty()
  verificationCode: string;
}
