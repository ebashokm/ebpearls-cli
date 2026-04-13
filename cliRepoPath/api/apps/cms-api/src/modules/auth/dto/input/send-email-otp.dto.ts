import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty } from 'class-validator';

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class SendEmailOTPDTO
 * @typedef {SendEmailOTPDTO}
 */
@InputType()
export class SendEmailOTPDTO {
  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field()
  @IsNotEmpty()
  deviceId: string;
}
