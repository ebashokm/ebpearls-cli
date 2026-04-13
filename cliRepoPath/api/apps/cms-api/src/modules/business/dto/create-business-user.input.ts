import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty } from 'class-validator';

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class CreateBusinessUserInput
 * @typedef {CreateBusinessUserInput}
 */
@InputType()
export class CreateBusinessUserInput {
  /**
   * ${1:Description placeholder}
   *
   * @type {string}
   */
  @Field()
  @IsNotEmpty()
  name: string;

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
  userId: string;
}
