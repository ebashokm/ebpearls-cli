import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class LoginAdminDTO
 * @typedef {LoginAdminDTO}
 */
@InputType()
export class LoginAdminDTO {
  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field(() => String)
  @IsNotEmpty()
  @IsEmail()
  email: string;

  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field(() => String)
  @IsNotEmpty()
  password: string;

  @Field({ nullable: true })
  @IsOptional()
  browser?: string;
}
